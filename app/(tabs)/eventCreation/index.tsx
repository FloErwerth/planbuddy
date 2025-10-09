import { useIsFocused } from "@react-navigation/core";
import { EventCreation } from "@/screens/Events/EventCreation";

export default function EventCreationScreen() {
	const isFocused = useIsFocused();

	if (!isFocused) {
		return null;
	}

	return <EventCreation />;
}
