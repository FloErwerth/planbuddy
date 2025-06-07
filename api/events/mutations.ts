import { useMutation, useQueryClient } from 'react-query';
import { useGetUser } from '@/store/user';
import { supabase } from '@/api/supabase';
import { Event } from './types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useUploadEventImageMutation } from '@/api/images';
import { QUERY_KEYS } from '@/api/queryKeys';

export const useCreateEventMutation = () => {
  const user = useGetUser();
  const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: Event) => {
      if (user === undefined) {
        return undefined;
      }

      const result: PostgrestSingleResponse<Event[]> = await supabase
        .from('events')
        .insert({ creatorId: user.id, ...event } satisfies Event)
        .select();

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.data.length > 1) {
        throw new Error('Something went wrong with the event creation in the database');
      }

      return result.data[0];
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.EVENTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.EVENTS.MUTATION],
  });
};
