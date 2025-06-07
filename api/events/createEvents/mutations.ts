import { useMutation } from 'react-query';
import { useGetUser } from '@/store/user';
import { supabase } from '@/api/supabase';
import { Event } from '../types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useUploadEventImageMutation } from '@/api/images';

export const useCreateEventMutation = () => {
  const user = useGetUser();
  const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();

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

      const createdEvent = result.data[0];

      if (event.imageToUpload && createdEvent.id) {
        const result = await uploadEventImage({
          image: event.imageToUpload,
          eventId: createdEvent.id,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      }

      return createdEvent.id;
    },
  });
};
