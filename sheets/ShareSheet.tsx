import { ClipboardCopy, Share2 } from "@tamagui/lucide-icons";
import * as ExpoClipboard from "expo-clipboard";
import { Pressable, Share } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { type SheetProps, SizableText, useWindowDimensions, View, XStack, YStack } from "tamagui";
import { useEventQuery } from "@/api/events/event/useEventQuery";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/tamagui/Card";
import { Sheet } from "@/components/tamagui/Sheet";
import { useTranslation } from "@/hooks/useTranslation";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";

const websiteURL = process.env.EXPO_PUBLIC_WEBPAGE_URL;

type ShareSheetProps = SheetProps;
export const ShareSheet = ({ ...props }: ShareSheetProps) => {
	const { eventId } = useEventDetailsContext();
	const { data: event, isLoading } = useEventQuery(eventId);
	const { width } = useWindowDimensions();
	const invitationLink = `${websiteURL}?eventId=${eventId}`;
	const { t } = useTranslation();

	if ((!isLoading && !event) || !websiteURL) {
		return null;
	}

	return (
		<Sheet {...props}>
			<Screen gap="$6" marginBottom="$4">
				<SizableText textAlign="center">{t("share.scanQR")}</SizableText>
				<Card alignSelf="center">
					<QRCode size={width * 0.5} value={invitationLink} />
				</Card>
				<XStack gap="$4" alignItems="center">
					<View height={1} flex={1} backgroundColor="rgb(200,200,200)" />
					<SizableText textAlign="center" zIndex={2} backgroundColor="$background">
						{t("share.or")}
					</SizableText>
					<View height={1} flex={1} backgroundColor="rgb(200,200,200)" />
				</XStack>
				<YStack gap="$4" alignItems="center">
					<Pressable onPress={async () => await Share.share({ url: invitationLink })}>
						<XStack left="$-2" gap="$4">
							<Share2 />
							<SizableText size="$5">{t("share.shareLink")}</SizableText>
						</XStack>
					</Pressable>
					<Pressable onPress={async () => await ExpoClipboard.setStringAsync(invitationLink)}>
						<XStack left="$-2" gap="$4">
							<ClipboardCopy />
							<SizableText size="$5">{t("share.copyLink")}</SizableText>
						</XStack>
					</Pressable>
				</YStack>
			</Screen>
		</Sheet>
	);
};
