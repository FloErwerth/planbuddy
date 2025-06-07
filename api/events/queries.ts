import { useQuery } from 'react-query';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Event } from '@/api/events/types';
import { QUERY_KEYS } from '@/api/queryKeys';

export const useEventsQuery = () => {
  const user = useGetUser();

  return useQuery({
    queryFn: async () => {
      if (!user) {
        return;
      }
      const result: PostgrestSingleResponse<Event[]> = await supabase
        .from('events')
        .select()
        .eq('creatorId', user.id);

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
    queryKey: [QUERY_KEYS.EVENTS.QUERY],
  });
};
