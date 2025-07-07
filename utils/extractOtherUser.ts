import { FriendsQueryResponse } from '@/api/friends/schema';

export const extractOtherUser = (userId: string, friend?: Partial<FriendsQueryResponse[number]>) => {
  const otherUser = friend?.requester?.id !== userId ? friend?.requester : friend?.receiver;

  return {
    ...friend,
    firstName: otherUser?.firstName,
    lastName: otherUser?.lastName,
    email: otherUser?.email,
  };
};
