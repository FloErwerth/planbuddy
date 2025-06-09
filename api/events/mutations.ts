import { useMutation, useQueryClient } from 'react-query';
import { useGetUser } from '@/store/user';
import { supabase } from '@/api/supabase';
import { Event, Participant } from './types';
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

      const participantResult = await supabase.from('participants').insert({
        userId: user.id,
        eventId: result.data[0].id,
        role: 'creator',
        status: 'accepted',
      });

      if (participantResult.error) {
        throw new Error(participantResult.error.message);
      }

      return result.data[0];
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.EVENTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.EVENTS.MUTATION],
  });
};

export const useParticipateEventMutation = () => {
  const user = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participant: Pick<Participant, 'userId' | 'eventId'>) => {
      if (user === undefined) {
        return undefined;
      }

      const participantExists = await supabase
        .from('participants')
        .select()
        .eq('userId', participant.userId)
        .eq('eventId', participant.eventId);

      if (participantExists.data?.length) {
        console.warn('Already got this participant.');
        return;
      }

      const result = await supabase
        .from('participants')
        .insert({ ...participant, role: 'guest', status: 'undecided' });

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.EVENTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.EVENTS.MUTATION],
  });
};
