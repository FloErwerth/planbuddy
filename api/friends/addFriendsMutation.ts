import { useMutation, useQueryClient } from 'react-query';
import { FRIENDS_MUTATION_KEY, FRIENDS_QUERY_KEY } from '@/api/friends/constants';
import { useGetUser } from '@/store/user';
import { supabase } from '@/api/supabase';
import { FriendsQueryResponse, SingleFriendQueryResponse } from '@/api/friends/schema';
import { StatusEnum } from '@/api/types';
import { QUERY_KEYS } from '@/api/queryKeys';
import { useFriendOverview } from '@/api/friends/refiners';

export const useAddFriendMutation = () => {
    const user = useGetUser();
    const queryClient = useQueryClient();
    const { data } = useFriendOverview();

    return useMutation({
        mutationFn: async (friendId: string) => {
            if (!user) {
                throw new Error('Probably not logged in.');
            }

            const isAlreadyFriend = data.find((friend) => friend.requester?.id === friendId || friend.receiver?.id === friendId);

            if (isAlreadyFriend) {
                return;
            }

            const result = await supabase
                .from('friends')
                .insert([
                    {
                        requesterId: user.id,
                        receiverId: friendId,
                        status: StatusEnum.PENDING,
                    } satisfies Omit<SingleFriendQueryResponse, 'id' | 'sendAt' | 'acceptedAt'>,
                ])
                .select();

            return !result.error;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries([FRIENDS_QUERY_KEY]);
            await queryClient.invalidateQueries([QUERY_KEYS.USERS.QUERY]);
        },
        mutationKey: [FRIENDS_MUTATION_KEY],
    });
};

export const useUpdateFriendMutation = () => {
    const user = useGetUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (friend: Partial<FriendsQueryResponse[number]>) => {
            if (!user) {
                throw new Error('Probably not logged in.');
            }

            const mapped = {
                ...friend,
                acceptedAt: friend.acceptedAt?.toISOString(),
                sendAt: friend.acceptedAt?.toISOString(),
            };

            const result = await supabase.from('friends').update(mapped).eq('id', friend.id).throwOnError().select();

            return !result.error;
        },
        mutationKey: [FRIENDS_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.invalidateQueries([FRIENDS_QUERY_KEY]);
        },
    });
};

export const useRemoveFriendMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (friendId?: string) => {
            const result = await supabase.from('friends').delete().eq('id', friendId).throwOnError().select();
            return !result.error;
        },
        mutationKey: [FRIENDS_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.refetchQueries([FRIENDS_QUERY_KEY]);
        },
    });
};
