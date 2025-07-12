import { useMutation, useQueryClient } from 'react-query';
import { useGetUser } from '@/store/user';
import { supabase } from '@/api/supabase';
import { BackendEvent, backendEventSchema, Event, Participant, Role } from './types';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { QUERY_KEYS } from '@/api/queryKeys';
import { StatusEnum } from '@/api/types';

export const useCreateEventMutation = () => {
  const user = useGetUser();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ event, guests }: { event: Event; guests: string[] }): Promise<BackendEvent | undefined> => {
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

      const insertedUsers = [
        {
          userId: user.id,
          eventId: insertedEvent.id,
          role: 'CREATOR',
          status: 'ACCEPTED',
        },
        ...guests.map((guestId) => ({
          userId: guestId,
          eventId: insertedEvent.id,
          role: 'GUEST',
          status: 'PENDING',
        })),
      ];

      const participantResult = await supabase.from('participants').insert(insertedUsers);

      if (participantResult.error) {
        throw new Error(participantResult.error.message);
      }

      return insertedEvent;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.EVENTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.EVENTS.CREATE],
  });
};

type ParticipantMutationArgs = Pick<Participant, 'userId' | 'eventId' | 'id'>;
export const useCreateParticipationMutation = () => {
  const user = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (participant: ParticipantMutationArgs | ParticipantMutationArgs[]) => {
      if (user === undefined) {
        return undefined;
      }

      const result = await supabase.from('participants').upsert(
        Array.isArray(participant)
          ? participant.map((singleParticipant) => ({
              ...singleParticipant,
              role: Role.enum.GUEST,
              status: StatusEnum.PENDING,
            }))
          : { ...participant, role: Role.enum.GUEST, status: StatusEnum.PENDING },
        { ignoreDuplicates: true }
      );

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.PARTICIPANTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.PARTICIPANTS.CREATE],
  });
};

type ParticipantUpdateMutationArgs = {
  id: string;
  participant: Partial<Omit<Participant, 'id'>>;
};
export const useUpdateParticipationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, participant }: ParticipantUpdateMutationArgs) => {
      const result = await supabase.from('participants').update(participant).eq('id', id).select();

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.PARTICIPANTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.PARTICIPANTS.UPDATE],
  });
};

export const useRemoveParticipantMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await supabase.from('participants').delete().eq('id', id).select();

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([QUERY_KEYS.PARTICIPANTS.QUERY]);
    },
    mutationKey: [QUERY_KEYS.PARTICIPANTS.REMOVE],
  });
};
