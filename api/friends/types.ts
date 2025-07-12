import { SingleFriendQueryResponse } from '@/api/friends/schema';

export type SimpleFriend = Partial<Pick<SingleFriendQueryResponse, 'id' | 'firstName' | 'lastName' | 'email' | 'status' | 'sendAt'>>;
