import { useParticipantsQuery } from '@/api/events/queries';
import { useMemo } from 'react';
import { useGetUser } from '@/store/authentication';

export const useMe = (eventId: string) => {
    const { data: participants = [] } = useParticipantsQuery(eventId);
    const user = useGetUser();

    return useMemo(() => participants.filter((participant) => participant.userId === user?.id)[0], [participants, user?.id]);
};
