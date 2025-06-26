import { useMutation, useQueryClient } from 'react-query';
import { FRIENDS_MUTATION_KEY, FRIENDS_QUERY_KEY } from '@/api/friends/constants';
import { useGetUser } from '@/store/user';
import { supabase } from '@/api/supabase';

export const useAddFriendsMutation = () => {
  const user = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (friends: string[]) => {
      if (!user) {
        throw new Error('Probably not logged in.');
      }

      const result = await supabase
        .from('friends')
        .insert(friends.map((id) => ({ fromUserId: user.id, toUserId: id, status: 'undecided' })))
        .select();

      console.log(result);

      return !result.error;
    },
    mutationKey: [FRIENDS_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries([FRIENDS_QUERY_KEY]);
    },
  });
};
