import { useSingleParticipantQuery } from "@/api/participants/singleParticipant/useSingleParticipant";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

export const useMe = (eventId: string) => {
	const { user } = useAuthenticationContext();
	const { data: participant } = useSingleParticipantQuery(eventId, user.id);

	return participant;
};
