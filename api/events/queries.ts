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

type Role = 'guest' | 'admin' | 'creator';

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

export const useParticipantsQuery = (eventId: string) => {
  return useQuery({
    queryFn: async (): Promise<ParticipantQueryResponse[]> => {
      const participantsAndUsers = await supabase
        .from('participants')
        .select('*, users(*)')
        .eq('eventId', eventId)
        .throwOnError();

      return participantsAndUsers.data.map((data) => ({
        ...data,
        ...data.users,
      })) as ParticipantQueryResponse[];
    },
    queryKey: [QUERY_KEYS.PARTICIPANTS.QUERY, eventId],
  });
};

export const useParticipantsImageQuery = (userId?: string) => {
  return useQuery({
    queryFn: async (): Promise<string | undefined> => {
      // get image
      const download = await supabase.storage
        .from('profile-images')
        .download(`${userId}/profileImage.png`);

      if (download.error) {
        if (download.error.name === 'StorageUnknownError') {
          // this is likely because of no image uploaded for the event
          return undefined;
        }
        throw new Error(download.error.message);
      }

      if (download.data.size < 100) {
        return;
      }

      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(download.data);
      });
    },
    queryKey: [QUERY_KEYS.PARTICIPANTS.IMAGE_QUERY, userId],
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
