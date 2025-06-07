import { useGetUser } from '@/store/user';
import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/api/supabase';
import { User } from '@/api/types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

export const useUpdateUserMutation = () => {
  const user = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      updatedUser,
      onSuccess,
    }: {
      updatedUser: Partial<User>;
      onSuccess: (user: User) => void;
    }) => {
      if (!user) {
        return;
      }

      const result = await supabase.from('users').update(updatedUser).eq('id', user.id).select();

      if (result.error) {
        throw new Error(result.error.message);
      }

      onSuccess(result.data[0]);
    },
    mutationKey: ['mutateUser'],
    onSuccess: async () => {
      await queryClient.invalidateQueries(['user']);
    },
  });
};

export const useInsertUserMutation = () => {
  const queryClient = useQueryClient();
  const user = useGetUser();
  return useMutation({
    mutationFn: async (insertedUser: Omit<Required<User>, 'id'>) => {
      if (!user) {
        return;
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
    mutationKey: ['mutateUser'],
    onSuccess: async () => {
      await queryClient.invalidateQueries(['user']);
    },
  });
};
