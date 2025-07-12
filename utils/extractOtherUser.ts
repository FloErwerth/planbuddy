import { FriendsQueryResponse } from '@/api/friends/schema';
import { useMemo } from 'react';
import { useGetUser } from '@/store/user';
import { SimpleFriend } from '@/api/friends/types';

export const useExtractOtherUser = (friend?: SimpleFriend) => {
  const user = useGetUser();
  return useMemo(() => extractOtherUser(user?.id!, friend), [friend, user]);
};

export const extractOtherUser = (userId: string, friend?: Partial<FriendsQueryResponse[number]>) => {
  const { me, other } = (() => {
    if (friend?.requester?.id !== userId) {
      return { me: friend?.receiver, other: friend?.requester };
    }
    return { me: friend?.requester, other: friend?.receiver };
  })();

  return {
    other,
    me,
    id: other?.id,
    firstName: other?.firstName,
    lastName: other?.lastName,
    email: other?.email,
  };
};
