import { useQuery } from 'react-query';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Event, Participant } from '@/api/events/types';
import { QUERY_KEYS } from '@/api/queryKeys';

type Role = 'guest' | 'admin' | 'creator';
type QueryResponse = { events: Event; role: Role }[];

export const useEventsQuery = () => {
  const user = useGetUser();

  return useQuery({
    queryFn: async () => {
      if (!user) {
        return;
      }

      const result: PostgrestSingleResponse<QueryResponse> = await supabase
        .from('participants')
        .select(`role,events(*)`)
        .eq('userId', user.id);

      if (result.error) {
        throw result.error;
      }

      return result.data.map((data) => ({
        ...data.events,
        role: data.role,
      }));
    },
    queryKey: [QUERY_KEYS.EVENTS.QUERY],
  });
};

type SingleQueryResponse = { events: Event; role: string; numberOfParticipants?: number };
export const useSingleEventQuery = (eventId: string) => {
  const user = useGetUser();

  return useQuery({
    queryFn: async () => {
      if (!user) {
        return undefined;
      }

      const result: PostgrestSingleResponse<SingleQueryResponse> = await supabase
        .from('participants')
        .select(`role, events(*)`)
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
        event: result.data.events,
        participants: {
          accepted: participants.data?.filter((participant) => participant.status === 'accepted')
            .length,
          total: participants.data?.length,
          role: result.data.role,
        },
      };
    },
    queryKey: [QUERY_KEYS.EVENTS.QUERY, eventId],
  });
};
