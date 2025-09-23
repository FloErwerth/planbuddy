import { Redirect, router } from "expo-router";
import { Image } from "expo-image";
import { useState } from "react";
import { Details } from "@/screens/EventDetails/components/Details";
import { ShareSheet } from "@/sheets/ShareSheet";
import { Screen, ScrollableScreen } from "@/components/Screen";
import { Spinner, View } from "tamagui";
import { BackButton } from "@/components/BackButton";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { useGetUser } from "@/store/authentication";
import { Button } from "@/components/tamagui/Button";
import { Pencil } from "@tamagui/lucide-icons";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { ParticipantRoleEnum } from "@/api/participants/types";

export const EventDetails = () => {
	const { eventId } = useEventDetailsContext();
	const user = useGetUser();
	const { data: me } = useSingleParticipantQuery(eventId, user.id);
	const [showShare, setShowShare] = useState(false);

	const { data: event, isLoading } = useSingleEventQuery(eventId);
	const { data: image } = useEventImageQuery(eventId);

	const hasMissingData = !user || !event;

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

	return (
		<>
			<ScrollableScreen
				back={<BackButton href="/(tabs)" />}
				action={
					me?.role === ParticipantRoleEnum.GUEST ? null : (
						<Button variant="round" onPress={() => router.push("/eventDetails/editEvent")}>
							<Pencil color="$color" size="$1" scale={0.75} />
						</Button>
					)
				}
			>
				{image && (
					<View backgroundColor="$background" overflow="hidden" elevationAndroid="$2" width="100%" borderRadius="$8">
						<Image source={image} style={{ width: "auto", height: 200 }} />
					</View>
				)}
				{event?.id && <Details />}
				{event?.id && <ShareSheet onOpenChange={setShowShare} open={showShare} />}
			</ScrollableScreen>
		</>
	);
};
function useSingleEventQuery(eventId: string): { data: any; isLoading: any } {
	throw new Error("Function not implemented.");
}

function useEventImageQuery(eventId: string): { data: any } {
	throw new Error("Function not implemented.");
}
