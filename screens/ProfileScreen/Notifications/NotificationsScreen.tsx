import { SizableText, YStack } from "tamagui";
import { BackButton } from "@/components/BackButton";
import { PressableRow } from "@/components/PressableRow";
import { Screen } from "@/components/Screen";
import { Checkbox } from "@/components/tamagui/Checkbox";
import { useTranslation } from "@/hooks/useTranslation";
import { NotificationChannelEnum, useNotificationContext } from "@/providers/NotificationsProvider";

export const NotificationsScreen = () => {
	const {
		channels: { toggle, isChannelActive },
	} = useNotificationContext();
	const { t } = useTranslation();

	return (
		<Screen back={<BackButton />} title={t("notifications.title")}>
			<YStack gap="$1.5">
				<SizableText>{t("notifications.eventParticipation")}</SizableText>
				<PressableRow
					onPress={() => toggle(NotificationChannelEnum.GUEST_INVITE)}
					iconRight={<Checkbox checked={isChannelActive(NotificationChannelEnum.GUEST_INVITE)} />}
				>
					<SizableText>{t("notifications.invitations")}</SizableText>
				</PressableRow>
				<PressableRow
					onPress={() => toggle(NotificationChannelEnum.GUEST_UPDATE)}
					iconRight={<Checkbox checked={isChannelActive(NotificationChannelEnum.GUEST_UPDATE)} />}
				>
					<SizableText>{t("notifications.updates")}</SizableText>
				</PressableRow>
				<PressableRow
					onPress={() => toggle(NotificationChannelEnum.GUEST_START)}
					iconRight={<Checkbox checked={isChannelActive(NotificationChannelEnum.GUEST_START)} />}
				>
					<SizableText>{t("notifications.start")}</SizableText>
				</PressableRow>
			</YStack>
			<YStack gap="$1.5">
				<SizableText>{t("notifications.eventManagement")}</SizableText>
				<PressableRow
					onPress={() => toggle(NotificationChannelEnum.HOST_INVITATION_ANSWERED)}
					iconRight={<Checkbox checked={isChannelActive(NotificationChannelEnum.HOST_INVITATION_ANSWERED)} />}
				>
					<SizableText>{t("notifications.invitationAnswered")}</SizableText>
				</PressableRow>
			</YStack>
		</Screen>
	);
};
