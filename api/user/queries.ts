import { useQuery } from 'react-query';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { User } from '@/api/types';

export const useUserQuery = () => {
  const user = useGetUser();

  return useQuery({
    queryFn: async () => {
      if (!user) {
        return;
      }

      const result = await supabase.from('users').select().eq('id', user.id);

      if (result.error) {
        throw new Error(result.error.message);
      }

      return result.data[0] as User;
    },
    queryKey: ['user'],
  });
};
