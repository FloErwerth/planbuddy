import { Screen } from "@/components/Screen";
import { Redirect } from "expo-router";
import { SizableText, useWindowDimensions, View, XStack, YStack } from "tamagui";
import { Card } from "@/components/tamagui/Card";
import QRCode from "react-native-qrcode-svg";
import * as ExpoClipboard from "expo-clipboard";
import { Pressable, Share } from "react-native";
import { ClipboardCopy, Share2 } from "@tamagui/lucide-icons";
import { BackButton } from "@/components/BackButton";
import { useEventQuery } from "@/api/events/event/useEventQuery";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";

const websiteURL = process.env.EXPO_PUBLIC_PLANBUDDY_WEBSITE_URL;

export const ShareEventScreen = () => {
	const { eventId } = useEventDetailsContext();
	const { data: event, isLoading } = useEventQuery(eventId);
	const { width } = useWindowDimensions();
	const invitationLink = `${websiteURL}?eventId=${eventId}`;

	if ((!isLoading && !event) || !websiteURL) {
		return <Redirect href="/(tabs)" />;
	}

	return (
		<Screen back={<BackButton href=".." />} title={`${event?.name} teilen`} gap="$8">
			<SizableText textAlign="center">Lasse deine Gäste diesen QR Code scannen</SizableText>
			<Card alignSelf="center">
				<QRCode size={width * 0.5} value={invitationLink} />
			</Card>
			<XStack gap="$4" alignItems="center">
				<View height={1} flex={1} backgroundColor="rgb(200,200,200)" />
				<SizableText textAlign="center" zIndex={2} backgroundColor="$background">
					Oder
				</SizableText>
				<View height={1} flex={1} backgroundColor="rgb(200,200,200)" />
			</XStack>
			<YStack gap="$4" alignItems="center">
				<Pressable onPress={async () => await Share.share({ url: invitationLink })}>
					<XStack left="$-2" gap="$4">
						<Share2 />
						<SizableText size="$5">Teile deinen Einladungslink</SizableText>
					</XStack>
				</Pressable>
				<Pressable onPress={async () => await ExpoClipboard.setStringAsync(invitationLink)}>
					<XStack left="$-2" gap="$4">
						<ClipboardCopy />
						<SizableText size="$5">Kopiere den Einladungslink</SizableText>
					</XStack>
				</Pressable>
			</YStack>
		</Screen>
	);
};
