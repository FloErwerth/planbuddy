import { useParticipantsQuery } from '@/api/events/queries';
import { useGetUser } from '@/store/user';
import { useMemo } from 'react';

export const useMe = (eventId: string) => {
    const { data: participants = [] } = useParticipantsQuery(eventId);
    const user = useGetUser();

    return useMemo(() => participants.filter((participant) => participant.userId === user?.id)[0], [participants, user?.id]);
};
