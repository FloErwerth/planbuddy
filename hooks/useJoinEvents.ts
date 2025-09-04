import { router, useGlobalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useCreateParticipationMutation } from "@/api/events/mutations";
import { writeInviteId } from "@/utils/invite";
import { useGetUser } from "@/store/authentication";

export const useJoinEvents = () => {
	const { eventId } = useGlobalSearchParams<{
		eventId: string;
		name: string;
		inviterName: string;
	}>();
	const user = useGetUser();
	const { mutateAsync: joinEvent } = useCreateParticipationMutation();

	useEffect(() => {
		if (eventId) {
			(async () => {
				await writeInviteId(eventId);
				if (user === undefined) {
					// redirect to special login page
					router.replace("/authentication");
					return;
				}
				// join the event
				await joinEvent({ eventId, userId: user.id });
			})();
		}
	}, [eventId, user]);
};
