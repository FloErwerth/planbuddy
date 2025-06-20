import { useMutation, useQueryClient } from 'react-query';
import { useGetUser } from '@/store/user';
import { supabase } from '@/api/supabase';
import { BackendEvent, backendEventSchema, Event, Participant } from './types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { useUploadEventImageMutation } from '@/api/images';
import { QUERY_KEYS } from '@/api/queryKeys';

export const useCreateEventMutation = () => {
  const user = useGetUser();
  const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (event: Event): Promise<BackendEvent | undefined> => {
      if (user === undefined) {
        return undefined;
      }

      const result: PostgrestSingleResponse<Event[]> = await supabase
        .from('events')
        .insert({ creatorId: user.id, ...event } satisfies Event)
        .select()
        .throwOnError();

      if (result.data.length > 1) {
        throw new Error('Something went wrong with the event creation in the database');
      }

      const insertedEvent = backendEventSchema.parse(result.data[0]);

      const participantResult = await supabase.from('participants').insert({
        userId: user.id,
        eventId: insertedEvent.id,
        role: 'creator',
        status: 'accepted',
      });

      if (participantResult.error) {
        throw new Error(participantResult.error.message);
      }

      return insertedEvent;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.EVENTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.EVENTS.MUTATION],
  });
};

export const useCreateParticipationMutation = () => {
  const user = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participant: Pick<Participant, 'userId' | 'eventId' | 'id'>) => {
      if (user === undefined) {
        return undefined;
      }

      const participantExists = await supabase
        .from('participants')
        .select()
        .eq('id', participant.id);

      if (participantExists.data?.length) {
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

export const useUpdateParticipationMutation = () => {
  const user = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participant: Participant) => {
      if (user === undefined) {
        return undefined;
      }

      const result = await supabase
        .from('participants')
        .update(participant)
        .eq('eventId', participant.eventId)
        .eq('userId', participant.userId)
        .select();

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.PARTICIPANTS.QUERY]);
      await queryClient.invalidateQueries([QUERY_KEYS.EVENTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.EVENTS.MUTATION],
  });
};
