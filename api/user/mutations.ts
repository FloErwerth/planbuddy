import { useGetUser } from '@/store/user';
import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/api/supabase';
import { User } from '@/api/types';

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
    onSuccess: async () => {
      await queryClient.invalidateQueries(['user']);
    },
  });
};
