import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { userSchema } from '@/api/types';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { useInfiniteQuery } from 'react-query';
import { INFINITE_FRIENDS_QUERY_KEY } from '@/api/friends/constants';
import { array } from 'zod';
import { debounce } from 'tamagui';
import { friendsQuerySchema } from '@/api/friends/schema';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { SimpleFriend } from '@/api/friends/types';

const NUMBER_OF_SEARCHED_FRIENDS = 15;

type SearchContextType = {
  friends: (SimpleFriend | undefined)[];
  search: (search: string) => void;
  setSearchDisplay: (search: string) => void;
  searchDisplay: string;
  onLoadMore: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useFriendSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('The searchContext must be used within a search context.');
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
      const range = getRange(pageParam, 5);

      const result = await supabase
        .from('users')
        .select()
        .or(`email.ilike.%${search}%, "firstName".ilike.%${search}%, "lastName".ilike.%${search}%`)
        .range(range[0], range[1])
        .throwOnError();

      const parsedResult = array(userSchema)
        .parse(result.data)
        .filter(({ id }) => id !== user?.id);

      const ids = parsedResult.map((item) => item.id).join(',');
      const friends = await supabase
        .from('friends')
        .select('*, requesterId(id, *), receiverId(id, *)') // Fetch nested user data
        .or(`requesterId.in.(${ids}),receiverId.in.(${ids})`)
        .range(range[0], range[1])
        .throwOnError();

      const parsedFriends = friendsQuerySchema.parse(friends.data);

      return parsedFriends.map((friend) => {
        return { status: friend.status, sendAt: friend.sendAt, ...extractOtherUser(user?.id!, friend).other };
      });
    },
    queryKey: [INFINITE_FRIENDS_QUERY_KEY, user?.id, search.toLowerCase()],
  });
};

export const FriendSearchProvider = ({ children, ...options }: PropsWithChildren) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchDisplay, setSearchDisplay] = useState('');
  const { data: friends, fetchNextPage } = useInfiniteSearch(debouncedSearch);
  const [renderedItems, setrenderedItems] = useState(NUMBER_OF_SEARCHED_FRIENDS);

  const onLoadMore = useCallback(async () => {
    setrenderedItems(renderedItems + NUMBER_OF_SEARCHED_FRIENDS);
    await fetchNextPage();
  }, [fetchNextPage, renderedItems]);

  const contextValue: SearchContextType = useMemo(
    () => ({
      friends: (friends ?? { pages: [] })?.pages.flat(1),
      search: debounce(setDebouncedSearch, 300),
      searchDisplay,
      setSearchDisplay,
      onLoadMore,
    }),
    [friends, searchDisplay, onLoadMore]
  );

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};
