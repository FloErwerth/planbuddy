import { SizableText, YStack } from "tamagui";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { type Participant, ParticipantRoleEnum } from "@/api/participants/types";
import type { User } from "@/api/user/types";
import { PressableRow } from "@/components/PressableRow";
import { Button } from "@/components/tamagui/Button";
import { Checkbox } from "@/components/tamagui/Checkbox";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";

type ParticipantEditGuestOptionsProps = {
	onRemoveGuest?: () => void;
};
export const EditGuestOptions = ({ onRemoveGuest }: ParticipantEditGuestOptionsProps) => {
	const { editedGuest: guest, setEditedGuest: setGuest, eventId } = useEventDetailsContext();
	const { user } = useAuthenticationContext();
	const { data: me } = useSingleParticipantQuery(eventId, user.id);
	const { t } = useTranslation();

	const toggleRole = () => {
		if (!guest) {
			return;
		}

		const newRole = guest.role !== ParticipantRoleEnum.ADMIN ? ParticipantRoleEnum.ADMIN : ParticipantRoleEnum.GUEST;

		const newGuest: Participant & User = {
			...guest,
			role: newRole,
		};

		setGuest(newGuest);
	};

	return (
		<YStack gap="$2">
			<SizableText>{t("guests.manageParticipation")}</SizableText>
			{me?.role === ParticipantRoleEnum.CREATOR && (
				<Button onPress={onRemoveGuest}>
					<SizableText color="$background">{t("guests.removeFromEvent", { name: guest?.firstName })}</SizableText>
				</Button>
			)}
			<YStack gap="$2" />
			<SizableText>{t("guests.role")}</SizableText>
			<PressableRow
				onPress={toggleRole}
				iconRight={<Checkbox onPress={toggleRole} checked={guest?.role === ParticipantRoleEnum.ADMIN} />}
				justifyContent="space-between"
			>
				<SizableText>{t("guests.isAdmin")}</SizableText>
			</PressableRow>
		</YStack>
	);
};
