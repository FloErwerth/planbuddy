import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { SizableText } from "tamagui";
import { useCreateParticipationMutation } from "@/api/participants/createParticipant";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";
import { writeInviteId } from "@/utils/invite";

export const JoinEventScreen = () => {
	const { user } = useAuthenticationContext();
	const { mutateAsync: joinEvent } = useCreateParticipationMutation();
	const { eventId } = useLocalSearchParams<{
		eventId: string;
		name: string;
		inviterName: string;
	}>();

	useEffect(() => {
		if (eventId) {
			if (user) {
				joinEvent({ eventId, userId: user.id }).then(() => router.replace("/(tabs)"));
			} else {
				writeInviteId(eventId).then(() => router.replace("/authentication"));
			}
		}
	}, [eventId, joinEvent, user]);

	return <SizableText>{eventId}</SizableText>;
};
