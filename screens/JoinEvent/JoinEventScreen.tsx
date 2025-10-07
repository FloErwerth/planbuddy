import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { writeInviteId } from "@/utils/invite";
import { useGetUser } from "@/store/authentication";
import { useCreateParticipationMutation } from "@/api/participants/createParticipant";
import { SizableText } from "tamagui";

export const JoinEventScreen = () => {
  const user = useGetUser();
  const { mutateAsync: joinEvent } = useCreateParticipationMutation();
  const { eventId, inviterName, name } = useLocalSearchParams<{
    eventId: string;
    name: string;
    inviterName: string;
  }>();

  useEffect(() => {
    if (eventId) {
      if (user) {
        joinEvent({ eventId, userId: user!.id }).then(() => router.replace("/(tabs)"));
      } else {
        writeInviteId(eventId).then(() => router.replace("/authentication"));
      }
    }
  }, [eventId, joinEvent, user]);

  return <SizableText>{eventId}</SizableText>;
};
