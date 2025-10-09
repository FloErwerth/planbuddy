import { Spinner } from "tamagui";
import { useEventQuery } from "@/api/events/event/useEventQuery";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { EventCreation } from "@/screens/Events/EventCreation";

export default function EditEvent() {
	const { eventId } = useEventDetailsContext();
	const { data: event, isLoading } = useEventQuery(eventId);

	if (isLoading) {
		return <Spinner />;
	}

	return <EventCreation event={event} />;
}
