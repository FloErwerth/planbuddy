import { useSingleEventQuery } from "@/api/events/queries";
import { EventCreation } from "@/screens/EventCreation";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { Spinner } from "tamagui";

export default function EditEvent() {
	const { eventId } = useEventDetailsContext();
	const { data: event, isLoading } = useSingleEventQuery(eventId);

	if (isLoading) {
		return <Spinner />;
	}

	return <EventCreation event={event} />;
}
