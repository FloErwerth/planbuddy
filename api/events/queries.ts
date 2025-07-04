import { useQuery } from 'react-query';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import {
  backendEventSchema,
  Event,
  Participant,
  ParticipantQueryResponse,
} from '@/api/events/types';
import { QUERY_KEYS } from '@/api/queryKeys';
import { Status } from '@/api/types';

export const useEventsQuery = () => {
  const user = useGetUser();

  return useQuery({
    queryFn: async () => {
      if (!user) {
        return;
      }

      const result = await supabase
        .from('participants')
        .select(`role,events(*)`)
        .eq('userId', user.id)
        .throwOnError();

      return result.data?.map((data) => ({
        ...backendEventSchema.parse(data.events),
        role: data.role,
      }));
    },
    queryKey: [QUERY_KEYS.EVENTS.QUERY, user?.id],
  });
};

type SingleQueryResponse = {
  events: Event;
  role: Participant['role'];
  status: Participant['status'];
  numberOfParticipants?: number;
};

export const useParticipantsQuery = (eventId: string, filters: Status[] = [], search = '') => {
  return useQuery({
    queryFn: async (): Promise<ParticipantQueryResponse[]> => {
      const participantsAndUsersQuery = supabase.from('participants').select('*, users(*)');

      if (search) {
        participantsAndUsersQuery.or(
          `email.ilike.%${search}%, "firstName".ilike.%${search}%, "lastName".ilike.%${search}%`,
          { foreignTable: 'users' }
        );
      }

      for (let i = 0; i < filters.length; ++i) {
        participantsAndUsersQuery.eq('status', filters[i]);
      }

      participantsAndUsersQuery.eq('eventId', eventId);

      participantsAndUsersQuery.throwOnError();
      const result = await participantsAndUsersQuery;

      return result.data
        ?.filter((data) => data.users !== null)
        .map((data) => ({
          ...data,
          ...data.users,
        })) as ParticipantQueryResponse[];
    },
    queryKey: [QUERY_KEYS.PARTICIPANTS.QUERY, eventId, filters, search],
  });
};

export const useSingleEventQuery = (eventId: string) => {
  const user = useGetUser();

  return useQuery({
    queryFn: async () => {
      if (!user) {
        return undefined;
      }

      const result: PostgrestSingleResponse<SingleQueryResponse> = await supabase
        .from('participants')
        .select(`role, status, events(*)`)
        .eq('events.id', eventId)
        .eq('userId', user.id)
        .filter('events', 'not.is', 'null')
        .single();

      const participants: PostgrestSingleResponse<Participant[]> = await supabase
        .from('participants')
        .select(`eventId, role, status`)
        .eq('eventId', eventId);

      if (result.error) {
        throw result.error;
      }

      return {
        ...result.data.events,
        participants: {
          accepted: participants.data?.filter((participant) => participant.status === 'accepted')
            .length,
          total: participants.data?.length,
          role: result.data.role,
          status: result.data.status,
        },
      };
    },
    queryKey: [QUERY_KEYS.EVENTS.QUERY, eventId],
  });
};
