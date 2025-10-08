import { CalendarDays, ChevronRight, ExternalLink, Link2, MapPin, Share, Users } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import { Redirect, router } from "expo-router";
import { useState } from "react";
import { Linking } from "react-native";
import { SizableText, Spinner, View, XStack } from "tamagui";
import { useEventQuery } from "@/api/events/event/useEventQuery";
import { useEventImageQuery } from "@/api/events/eventImage";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { ParticipantRoleEnum } from "@/api/participants/types";
import { BackButton } from "@/components/BackButton";
import { PressableRow } from "@/components/PressableRow";
import { Screen, ScrollableScreen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { Separator } from "@/components/tamagui/Separator";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { ShareSheet } from "@/sheets/ShareSheet";
import { formatToDate, formatToTime } from "@/utils/date";

const EventDetailsActions = () => {
	const { user } = useAuthenticationContext();
	const { eventId } = useEventDetailsContext();
	const { data: me } = useSingleParticipantQuery(eventId, user.id);

	// todo change role to contributor if available
	const isContributor = me?.role === ParticipantRoleEnum.ADMIN || me?.role === ParticipantRoleEnum.CREATOR;

	if (isContributor) {
		return null;
	}

	return (
		<View flexDirection="row" gap="$3" flex={1}>
			<Button flex={1} size="$3" borderRadius="$4" onPress={() => router.push("/eventDetails/inviteGuests")}>
				Gäste einladen
			</Button>
			<Button flex={1} variant="secondary" size="$3" borderRadius="$4" onPress={() => undefined}>
				Aktionen
			</Button>
			<Button flex={1} variant="secondary" size="$3" borderRadius="$4" onPress={() => router.push("/eventDetails/editEvent")}>
				Verwalten
			</Button>
		</View>
	);
};

export const EventDetails = () => {
	const { eventId } = useEventDetailsContext();
	const { user } = useAuthenticationContext();
	const { data: me } = useSingleParticipantQuery(eventId, user.id);
	const [showShare, setShowShare] = useState(false);

	const { data: event, isLoading } = useEventQuery(eventId);
	const { data: image } = useEventImageQuery(eventId);

	const hasMissingData = !user || !event || !event.id;

	if (isLoading) {
		return (
			<Screen flex={1} justifyContent="center" alignItems="center">
				<Spinner size="large" />
			</Screen>
		);
	}

	if (!isLoading && hasMissingData) {
		return <Redirect href="/(tabs)" />;
	}

	const url = (() => {
		if (!event?.link) {
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
		<ScrollableScreen
			back={<BackButton href="/(tabs)" />}
			action={
				me?.role === ParticipantRoleEnum.GUEST ? null : (
					// todo: share event
					<Button variant="round" onPress={() => router.push("/eventDetails/shareEvent")}>
						<Share color="$color" size="$1" scale={0.75} />
					</Button>
				)
			}
		>
			{image && (
				<View backgroundColor="$background" overflow="hidden" elevationAndroid="$2" width="100%" borderRadius="$8">
					<Image source={image} style={{ width: "auto", height: 200 }} />
				</View>
			)}
			<SizableText size="$10" fontWeight="700">
				{event?.name}
			</SizableText>
			<EventDetailsActions />
			<PressableRow icon={<CalendarDays />}>
				<XStack alignItems="center" gap="$5">
					<View>
						<SizableText size="$5">{formatToDate(event?.startTime)}</SizableText>
						<SizableText size="$4">{formatToTime(event?.startTime)} Uhr</SizableText>
					</View>
					<SizableText>bis</SizableText>
					<View>
						<SizableText size="$5">{formatToDate(event?.endTime)}</SizableText>
						<SizableText size="$4">{formatToTime(event?.endTime)} Uhr</SizableText>
					</View>
				</XStack>
			</PressableRow>
			<PressableRow icon={<MapPin />} iconRight={null}>
				<SizableText>{event?.location}</SizableText>
			</PressableRow>

			<PressableRow icon={<Users />} onPress={() => router.push("/eventDetails/participants")} iconRight={<ChevronRight size="$1" />}>
				<SizableText>Gäste</SizableText>
			</PressableRow>
			{url && (
				<PressableRow icon={<Link2 />} onPress={handleOpenLink} iconRight={<ExternalLink scale={0.75} size="$1" />}>
					<SizableText>{url.host}</SizableText>
				</PressableRow>
			)}
			<ShareSheet onOpenChange={setShowShare} open={showShare} />
			{event?.description && (
				<>
					<Separator />
					<SizableText size="$6" fontWeight="700">
						Details
					</SizableText>
					<SizableText>{event?.description}</SizableText>
				</>
			)}
		</ScrollableScreen>
	);
};
