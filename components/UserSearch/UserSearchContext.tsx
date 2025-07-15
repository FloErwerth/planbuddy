import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';
import { Status, User, userSchema } from '@/api/types';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { useInfiniteQuery } from 'react-query';
import { array } from 'zod';
import { debounce } from 'tamagui';
import { friendsQuerySchema } from '@/api/friends/schema';
import { QUERY_KEYS } from '@/api/queryKeys';
import { FRIENDS_QUERY_KEY } from '@/api/friends/constants';

const NUMBER_OF_SEARCHED_USERS = 15;

export type UserWithStatus = User & { status?: Status; receiver?: User; requester?: User };
type SearchContextType = {
  users: UserWithStatus[] | undefined;
  search: (search: string) => void;
  setSearchDisplay: (search: string) => void;
  searchDisplay: string;
  onLoadMore: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

type UserSearchOptions = {
  showUsersWhenEmpty?: boolean;
  showOnlyFriends?: boolean;
};

export const useUserSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('The user search must be used within a user search search context.');
  }

  return context as SearchContextType;
};

function getRange(page: number, limit: number) {
  const from = page * limit;
  const to = from + limit - 1;

  return [from, to];
}

const useInfiniteSearch = (search: string, { showUsersWhenEmpty = false }: UserSearchOptions) => {
  const user = useGetUser();

  return useInfiniteQuery({
    getNextPageParam: (lastPage: unknown[] | undefined, allPages: unknown[]) => {
      return lastPage && Array.isArray(lastPage) && lastPage.length ? allPages?.length : undefined;
    },
    queryFn: async ({ pageParam = 0 }) => {
      const range = getRange(pageParam, 5);

      if (!showUsersWhenEmpty && !search) {
        return [];
      }

      const result = await supabase
        .from('users')
        .select()
        .or(`email.ilike.%${search}%, "firstName".ilike.%${search}%, "lastName".ilike.%${search}%`)
        .order('firstName')
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
        .throwOnError();

      const parsedFriends = friendsQuerySchema.parse(friends.data);

      const users = parsedResult.map((user) => {
        const foundFriend = parsedFriends.find((friend) => friend.requester.id === user.id || friend.receiver.id === user.id);
        return {
          status: foundFriend?.status ?? undefined,
          requester: foundFriend?.requester,
          receiver: foundFriend?.receiver,
          ...user,
        };
      }) as UserWithStatus[];

      return users;
    },
    queryKey: [FRIENDS_QUERY_KEY, QUERY_KEYS.USERS.QUERY, user?.id, search.toLowerCase()],
  });
};

export const UserSearchProvider = ({ children, ...options }: PropsWithChildren & UserSearchOptions) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchDisplay, setSearchDisplay] = useState('');
  const { data: users, fetchNextPage } = useInfiniteSearch(debouncedSearch, options);
  const [renderedItems, setrenderedItems] = useState(NUMBER_OF_SEARCHED_USERS);

  const onLoadMore = useCallback(async () => {
    setrenderedItems(renderedItems + NUMBER_OF_SEARCHED_USERS);
    await fetchNextPage();
  }, [fetchNextPage, renderedItems]);

  const contextValue: SearchContextType = useMemo(
    () => ({
      users: Array.from(
        (users?.pages.flat(1) ?? [])
          .reduce((uniqueUsers, current) => {
            uniqueUsers.set(current.id!, current);

            return uniqueUsers;
          }, new Map<string, UserWithStatus>())
          .values()
      ),
      search: debounce(setDebouncedSearch, 300),
      searchDisplay,
      setSearchDisplay,
      onLoadMore,
    }),
    [users?.pages, searchDisplay, onLoadMore]
  );

  return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};
