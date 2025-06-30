import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { Status, User, userSchema } from '@/api/types';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { useInfiniteQuery } from 'react-query';
import { FRIENDS_QUERY_KEY } from '@/api/friends/constants';
import { QUERY_KEYS } from '@/api/queryKeys';
import { array } from 'zod';
import { debounce } from 'tamagui';
import { friendsQuerySchema } from '@/api/friends/schema';

export type UserWithStatus = User & { status?: Status; receiver?: User; requester?: User };
type SearchContextType = {
  users: UserWithStatus[] | undefined;
  search: (search: string) => void;
  onLoadMore: () => void;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error('The searchContext must be used within a search context.');
  }

  return context as SearchContextType;
};

const defaultSearch = 15;
function getRange(page: number, limit: number) {
  const from = page * limit;
  const to = from + limit - 1;

  return [from, to];
}
const useInfiniteSearch = (search: string) => {
  const user = useGetUser();

  return useInfiniteQuery({
    getNextPageParam: (lastPage: unknown[] | undefined, allPages: unknown[]) => {
      return lastPage?.length ? allPages?.length : undefined;
    },
    queryFn: async ({ pageParam = 0 }) => {
      const range = getRange(pageParam, 5);

      if (!search) {
        return [];
      }

      const result = await supabase
        .from('users')
        .select()
        .or(`email.ilike.%${search}%, "firstName".ilike.%${search}%, "lastName".ilike.%${search}%`)
        .range(range[0], range[1]);

      const parsedResult = array(userSchema)
        .parse(result.data)
        .filter(({ id }) => id !== user?.id);
      const ids = parsedResult.map((item) => item.id).join(',');

      const friends = await supabase
        .from('friends')
        .select('*, requesterId(id, *), receiverId(id, *)') // Fetch nested user data
        .or(`requesterId.in.(${ids}),receiverId.in.(${ids})`);

      const parsedFriends = friendsQuerySchema.parse(friends.data);

      return parsedResult.map((user) => {
        const foundFriend = parsedFriends.find(
          (friend) => friend.requester.id === user.id || friend.receiver.id === user.id
        );
        return {
          status: foundFriend?.status ?? undefined,
          requester: foundFriend?.requester,
          receiver: foundFriend?.requester,
          ...user,
        };
      }) as UserWithStatus[];
    },
    queryKey: [FRIENDS_QUERY_KEY, QUERY_KEYS.USERS.QUERY, user?.id, search.toLowerCase()],
  });
};
export const SearchContextProvider = ({ children }: PropsWithChildren) => {
  const [search, setSearch] = useState('');
  const { data: users, fetchNextPage, isFetching } = useInfiniteSearch(search);
  const [renderedItems, setRenderedItems] = useState(defaultSearch);

  const onLoadMore = useCallback(async () => {
    setRenderedItems(renderedItems + 15);
    await fetchNextPage();
  }, [fetchNextPage, renderedItems]);

  const value = useMemo(
    () => ({
      users: users?.pages.flat(1),
      search: debounce(setSearch, 300),
      onLoadMore,
    }),
    [users?.pages, onLoadMore]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
