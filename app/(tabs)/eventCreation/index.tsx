import { EventCreation } from "@/screens/EventCreation";
import { useIsFocused } from "@react-navigation/core";

export default function EventCreationScreen() {
	const isFocused = useIsFocused();

	if (!isFocused) {
		return null;
	}

	return <EventCreation />;
}
