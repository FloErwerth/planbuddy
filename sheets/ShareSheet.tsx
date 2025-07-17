import { Sheet } from '@/components/tamagui/Sheet';
import { useSingleEventQuery } from '@/api/events/queries';
import { SheetProps, SizableText, useWindowDimensions, View, XStack, YStack } from 'tamagui';
import { Card } from '@/components/tamagui/Card';
import QRCode from 'react-native-qrcode-svg';
import { Pressable, Share } from 'react-native';
import { ClipboardCopy, Share2 } from '@tamagui/lucide-icons';
import * as ExpoClipboard from 'expo-clipboard';
import { Screen } from '@/components/Screen';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';

const websiteURL = process.env.EXPO_PUBLIC_WEBPAGE_URL;

type ShareSheetProps = SheetProps;
export const ShareSheet = ({ ...props }: ShareSheetProps) => {
    const { eventId } = useEventDetailsContext();
    const { data: event, isLoading } = useSingleEventQuery(eventId);
    const { width } = useWindowDimensions();
    const invitationLink = `${websiteURL}?eventId=${eventId}`;

    if ((!isLoading && !event) || !websiteURL) {
        return null;
    }

    return (
        <Sheet {...props}>
            <Screen gap="$6" marginBottom="$4">
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
        </Sheet>
    );
};
