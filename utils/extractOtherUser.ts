import { FriendsQueryResponse } from '@/api/friends/schema';
import { useCallback, useMemo } from 'react';
import { useGetUser } from '@/store/user';
import { SimpleFriend } from '@/api/friends/types';

export const useExtractedUser = (friend?: SimpleFriend) => {
  const user = useGetUser();
  return useMemo(() => extractOtherUser(user?.id!, friend), [friend, user]);
};

export const extractOtherUser = (userId?: string, friend?: Partial<FriendsQueryResponse[number]>) => {
  const { me, other } = (() => {
    if (friend?.requester?.id !== userId) {
      return { me: friend?.receiver, other: friend?.requester };
    }
    return { me: friend?.requester, other: friend?.receiver };
  })();

  const simpleFriend: SimpleFriend = {
    id: friend?.id,
    userId: other?.id,
    status: friend?.status,
    firstName: other?.firstName,
    lastName: other?.lastName,
    email: other?.email,
    sendAt: friend?.sendAt,
    acceptedAt: friend?.acceptedAt,
  };

  return {
    other,
    me,
    ...simpleFriend,
  };
};

export const useExtractOtherUser = () => {
  const user = useGetUser();
  return useCallback((friend: SimpleFriend) => extractOtherUser(user?.id!, friend), [user]);
};
