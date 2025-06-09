import { router, useGlobalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useGetUser } from '@/store/user';
import { useParticipateEventMutation } from '@/api/events/mutations';
import { writeInviteId } from '@/utils/invite';

export const useJoinEvents = () => {
  const { eventId } = useGlobalSearchParams<{
    eventId: string;
    name: string;
    inviterName: string;
  }>();
  const user = useGetUser();
  const { mutateAsync: joinEvent } = useParticipateEventMutation();

  useEffect(() => {
    if (eventId) {
      (async () => {
        await writeInviteId(eventId);
        if (user === undefined) {
          // redirect to special login page
          router.replace('/login');
          return;
        }
        // join the event
        await joinEvent({ eventId, userId: user.id });
      })();
    }
  }, [eventId, user]);
};
