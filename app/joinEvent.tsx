import { router, useGlobalSearchParams } from 'expo-router';
import { useGetUser } from '@/store/user';
import { writeInviteId } from '@/utils/invite';
import { useEffect } from 'react';
import { useCreateParticipationMutation } from '@/api/events/mutations';

export default function JoinEventScreen() {
    const user = useGetUser();
    const { mutateAsync: joinEvent } = useCreateParticipationMutation();
    const { eventId, inviterName, name } = useGlobalSearchParams<{
        eventId: string;
        name: string;
        inviterName: string;
    }>();

    useEffect(() => {
        if (eventId) {
            if (user) {
                joinEvent({ eventId, userId: user!.id }).then(() => router.replace('/(tabs)'));
            } else {
                writeInviteId(eventId).then(() => router.replace('/login'));
            }
        }
    }, [eventId, joinEvent, user]);

    return null;
}
