import { useParticipantsQuery } from '@/api/events/queries';
import { useGetUser } from '@/store/authentication';

export const useMe = (eventId: string) => {
    const { data: participants = [] } = useParticipantsQuery(eventId);
    const user = useGetUser();

    return participants.filter((participant) => participant.userId === user?.id)[0];
};
