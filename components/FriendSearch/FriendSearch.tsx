import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { useInfiniteQuery } from 'react-query';
import { INFINITE_FRIENDS_QUERY_KEY } from '@/api/friends/constants';
import { debounce } from 'tamagui';
import { friendsQuerySchema } from '@/api/friends/schema';
import { SimpleFriend } from '@/api/friends/types';
import { extractOtherUser } from '@/utils/extractOtherUser';

const NUMBER_OF_SEARCHED_FRIENDS = 15;

type SearchContextType = {
  friends: SimpleFriend[];
  search: (search: string) => void;
  setSearchDisplay: (search: string) => void;
  searchDisplay: string;
  onLoadMore: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useFriendSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('The friend search must be used within a friend search context.');
  }

  return context as SearchContextType;
};

function getRange(page: number, limit: number) {
  const from = page * limit;
  const to = from + limit - 1;

  return [from, to];
}

const useInfiniteSearch = (search: string) => {
  const user = useGetUser();

  return useInfiniteQuery({
    getNextPageParam: (lastPage: unknown[] | undefined, allPages: unknown[]) => {
      return lastPage && Array.isArray(lastPage) && lastPage.length ? allPages?.length : undefined;
    },
    queryFn: async ({ pageParam = 0 }) => {
      const range = getRange(pageParam, NUMBER_OF_SEARCHED_FRIENDS);

      const friends = await supabase
        .from('friends')
        .select('*,requesterId(id,*),receiverId(id,*)')
        .or(`requesterId.eq.${user?.id},receiverId.eq.${user?.id}`)
        .range(range[0], range[1])
        .throwOnError();

      return friendsQuerySchema
        .parse(friends.data)
        .map((friend) => {
          const other = extractOtherUser(user?.id, friend).other;
          return { status: friend.status, sendAt: friend.sendAt, ...other };
        })
        .filter(({ firstName, lastName, email }) => firstName?.includes(search) || lastName?.includes(search) || email?.includes(search));
    },
    queryKey: [INFINITE_FRIENDS_QUERY_KEY, user?.id, search.toLowerCase()],
  });
};

export const FriendSearchProvider = ({ children }: PropsWithChildren) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchDisplay, setSearchDisplay] = useState('');
  const { data: friends, fetchNextPage } = useInfiniteSearch(debouncedSearch);
  const [renderedItems, setrenderedItems] = useState(NUMBER_OF_SEARCHED_FRIENDS);

  const onLoadMore = useCallback(async () => {
    setrenderedItems(renderedItems + NUMBER_OF_SEARCHED_FRIENDS);
    await fetchNextPage();
  }, [fetchNextPage, renderedItems]);

  const flattenPages: SimpleFriend[] = useMemo(() => friends?.pages.flat(1) ?? [], [friends?.pages]);

  const exactFriend: SimpleFriend[] = useMemo(() => {
    const found = flattenPages?.find(({ firstName, lastName, email }) => `${firstName} ${lastName}` === debouncedSearch || email === debouncedSearch);
    if (found) {
      return [found];
    }

    return [];
  }, [debouncedSearch, flattenPages]);

  const contextValue: SearchContextType = useMemo(
    () => ({
      friends: exactFriend || flattenPages,
      search: debounce(setDebouncedSearch, 300, false),
      searchDisplay,
      setSearchDisplay,
      onLoadMore,
    }),
    [exactFriend, flattenPages, searchDisplay, onLoadMore]
  );

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};
