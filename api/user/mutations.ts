import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/api/supabase';
import { User } from '@/api/types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useGetUser } from '@/store/authentication';
import { INSERT_USERS_MUTATION_KEY, UPDATE_USERS_MUTATION_KEY, USERS_QUERY_KEY } from '@/api/user/constants';

export const useUpdateUserMutation = () => {
    const user = useGetUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ updatedUser, onSuccess }: { updatedUser: Partial<User>; onSuccess: (user: User) => void }) => {
            if (!user) {
                throw new Error('Error in update user: user not defined, probably not logged in');
            }

            const result = await supabase.from('users').update(updatedUser).eq('id', user.id).select();

            if (result.error) {
                throw new Error(result.error.message);
            }

            onSuccess(result.data[0]);
        },
        mutationKey: [UPDATE_USERS_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.invalidateQueries([USERS_QUERY_KEY]);
        },
    });
};

export const useInsertUserMutation = () => {
    const queryClient = useQueryClient();
    const user = useGetUser();
    return useMutation({
        mutationFn: async (insertedUser: Omit<User, 'id'>) => {
            if (!user) {
                throw new Error('Error in insert user: user not defined, probably not logged in');
            }

            const result: PostgrestSingleResponse<User[]> = await supabase
                .from('users')
                .insert({ id: user.id, ...insertedUser })
                .select();

            if (result.error) {
                throw new Error(result.error.message);
            }

            return result.data?.[0];
        },
        mutationKey: [INSERT_USERS_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.invalidateQueries([USERS_QUERY_KEY]);
        },
    });
};
