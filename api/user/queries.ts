import { useQuery } from 'react-query';
import { supabase } from '@/api/supabase';
import { User } from '@/api/types';
import { useGetUser } from '@/store/authentication';
import { USERS_QUERY_KEY } from '@/api/user/constants';

export const useUserQuery = () => {
    const user = useGetUser();

    return useQuery({
        queryFn: async () => {
            if (!user) {
                throw new Error('Error in user query: user not defined, probably not logged in');
            }

            const result = await supabase.from('users').select().eq('id', user.id);

            if (result.error) {
                throw new Error(result.error.message);
            }

            return result.data[0] as User;
        },
        queryKey: [USERS_QUERY_KEY, user?.id],
    });
};
