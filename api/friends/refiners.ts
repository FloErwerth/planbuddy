import { useDatabaseFriendsQuery } from '@/api/friends/databaseQuery';
import { StatusEnum } from '@/api/types';
import { useMemo } from 'react';
import { useGetUser } from '@/store/user';
import { sortFriendsToTop } from '@/utils/sorters';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { SimpleFriend } from '@/api/friends/types';

export const useFriendsByStatus = () => {
  const { data = [], refetch, isLoading } = useDatabaseFriendsQuery();

  return useMemo(
    () => ({
      accepted: data.filter((friend) => friend.status === StatusEnum.ACCEPTED),
      pending: data.filter((friend) => friend.status === StatusEnum.PENDING),
      declined: data.filter((friend) => friend.status === StatusEnum.DECLINED),
      refetch,
      isLoading,
    }),
    [isLoading, data, refetch]
  );
};

export const useFriendOverview = () => {
  const { data = [], refetch, isLoading } = useDatabaseFriendsQuery();
  const user = useGetUser();
  const pending = useMemo(() => data.filter((friend) => friend.status === StatusEnum.PENDING), [data]);

  return useMemo(
    () => ({
      data: data.sort(sortFriendsToTop),
      others: data.map((friend) => extractOtherUser(user?.id!, friend)) as SimpleFriend[],
      pending,
      pendingToAccept: pending.filter((friend) => friend.requester?.id !== user?.id),
      refetch,
      isLoading,
    }),
    [data, pending, refetch, isLoading, user?.id]
  );
};

export const useHasFriends = () => {
  const { accepted } = useFriendsByStatus();
  return accepted.length > 0;
};
