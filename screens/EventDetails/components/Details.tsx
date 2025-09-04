import { useSingleEventQuery } from "@/api/events/queries";
import { PressableRow } from "@/components/PressableRow";
import { Card } from "@/components/tamagui/Card";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { formatToDate, formatToTime } from "@/utils/date";
import { CalendarDays, ChevronRight, ExternalLink, Link2, MapPin, MessageSquareText, Users } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import { Linking } from "react-native";
import { SizableText, XStack } from "tamagui";

export const Details = () => {
	const { eventId } = useEventDetailsContext();
	const { data: event } = useSingleEventQuery(eventId);

	if (!event) {
		return null;
	}

	const url = (() => {
		if (!event.link) {
			return undefined;
		}
		const url = new URL(event.link);
		if (url.toString() === "INVALID_URL") {
			return undefined;
		}

		return url;
	})();

	const handleOpenLink = async () => {
		if (url && (await Linking.canOpenURL(url.toString()))) {
			await Linking.openURL(url.toString());
		}
	};

	return (
		<>
			<SizableText textAlign="center" size="$8">
				{event.name}
			</SizableText>
			<XStack alignItems="center" gap="$3">
				<CalendarDays />
				<Card flex={1} alignItems="center" padding="$3" borderRadius="$4">
					<SizableText size="$5">{formatToDate(event.startTime)}</SizableText>
					<SizableText>{formatToTime(event.startTime)} Uhr</SizableText>
				</Card>
				<SizableText>bis</SizableText>
				<Card flex={1} alignItems="center" padding="$3" borderRadius="$4">
					<SizableText size="$5">{formatToDate(event.endTime)}</SizableText>
					<SizableText>{formatToTime(event.endTime)} Uhr</SizableText>
				</Card>
			</XStack>
			<PressableRow icon={<MapPin />} iconRight={null}>
				<SizableText>{event.location}</SizableText>
			</PressableRow>
			{event.description && (
				<PressableRow icon={<MessageSquareText />} iconRight={null}>
					<SizableText>{event.description}</SizableText>
				</PressableRow>
			)}
			<PressableRow icon={<Users />} onPress={() => router.push(`/eventDetails/participants`)} iconRight={<ChevronRight size="$1" />}>
				<SizableText>Gäste</SizableText>
			</PressableRow>
			{url && (
				<PressableRow icon={<Link2 />} onPress={handleOpenLink} iconRight={<ExternalLink scale={0.75} size="$1" />}>
					<SizableText>{url.host}</SizableText>
				</PressableRow>
			)}
		</>
	);
};
