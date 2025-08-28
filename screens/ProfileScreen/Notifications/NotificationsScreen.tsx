import { BackButton } from '@/components/BackButton';
import { PressableRow } from '@/components/PressableRow';
import { Screen } from '@/components/Screen';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { NotificationChannelEnum, useNotificationContext } from '@/providers/NotificationsProvider';
import { YStack, SizableText } from 'tamagui';

export const NotificationsScreen = () => {
    const {
        channels: { toggle, isChannelActive },
    } = useNotificationContext();

    return (
        <Screen back={<BackButton />} title="Benachrichtigungen">
            <YStack gap="$1.5">
                <SizableText>Event Teilnahme</SizableText>
                <PressableRow
                    onPress={() => toggle(NotificationChannelEnum.GUEST_INVITE)}
                    iconRight={<Checkbox checked={isChannelActive(NotificationChannelEnum.GUEST_INVITE)} />}
                >
                    <SizableText>Einladungen</SizableText>
                </PressableRow>
                <PressableRow
                    onPress={() => toggle(NotificationChannelEnum.GUEST_UPDATE)}
                    iconRight={<Checkbox checked={isChannelActive(NotificationChannelEnum.GUEST_UPDATE)} />}
                >
                    <SizableText>Aktualisierungen</SizableText>
                </PressableRow>
                <PressableRow
                    onPress={() => toggle(NotificationChannelEnum.GUEST_START)}
                    iconRight={<Checkbox checked={isChannelActive(NotificationChannelEnum.GUEST_START)} />}
                >
                    <SizableText>Start</SizableText>
                </PressableRow>
            </YStack>
            <YStack gap="$1.5">
                <SizableText>Event Verwaltung</SizableText>
                <PressableRow
                    onPress={() => toggle(NotificationChannelEnum.HOST_INVITATION_ANSWERED)}
                    iconRight={<Checkbox checked={isChannelActive(NotificationChannelEnum.HOST_INVITATION_ANSWERED)} />}
                >
                    <SizableText>Auf Einladung geantwortet</SizableText>
                </PressableRow>
            </YStack>
        </Screen>
    );
};
