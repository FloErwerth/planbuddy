import { ParticipantQueryResponse } from "@/api/events/types";

export type EditGuestProps = {
	me: ParticipantQueryResponse;
	onRemoveGuest: () => void;
	guest?: ParticipantQueryResponse;
};
