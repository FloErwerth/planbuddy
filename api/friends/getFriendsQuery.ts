import { useQuery } from 'react-query';
import { FRIENDS_QUERY_KEY } from '@/api/friends/constants';
import { useGetUser } from '@/store/user';
import { supabase } from '@/api/supabase';
import { User } from '@/api/types';
import { ParticipantStatus } from '@/api/events/types';

export type FriendsQueryResponse = User & { status: ParticipantStatus };
export const useGetFriendsQuery = (showDeclined = false) => {
  const user = useGetUser();

  return useQuery({
    queryFn: async (): Promise<FriendsQueryResponse[]> => {
      if (!user) {
        return [];
      }

      const base = supabase
        .from('friends')
        .select('id,fromUserId(id,*),toUserId(id,*),status')
        .or(`fromUserId.eq.${user.id},toUserId.eq.${user.id}`);

      const friends = showDeclined ? await base : await base.neq('status', 'declined');

      console.log(friends);

      const toUserIds =
        (friends.data?.map((value) => {
          return { status: value.status, ...value.toUserId };
        }) as FriendsQueryResponse[] | undefined) ?? [];
      const fromUserIds =
        (friends.data?.map((value) => {
          return { status: value.status, ...value.fromUserId };
        }) as FriendsQueryResponse[] | undefined) ?? [];

      const isInvalid = (checkedUser: FriendsQueryResponse) => {
        return checkedUser.id !== user.id;
      };

      return [...toUserIds, ...fromUserIds].filter(isInvalid);
    },
    queryKey: [FRIENDS_QUERY_KEY, user?.id, showDeclined],
  });
};
