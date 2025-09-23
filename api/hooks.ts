import { useSingleParticipantQuery } from "@/api/participants/singleParticipant/useSingleParticipant";
import { useGetUser } from "@/store/authentication";

export const useMe = (eventId: string) => {
	const user = useGetUser();
	const { data: participant } = useSingleParticipantQuery(eventId, user.id);

	return participant;
};
