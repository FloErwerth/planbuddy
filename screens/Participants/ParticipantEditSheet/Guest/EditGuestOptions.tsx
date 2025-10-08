import { SizableText, YStack } from "tamagui";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { type Participant, ParticipantRoleEnum } from "@/api/participants/types";
import type { User } from "@/api/user/types";
import { PressableRow } from "@/components/PressableRow";
import { Button } from "@/components/tamagui/Button";
import { Checkbox } from "@/components/tamagui/Checkbox";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";

type ParticipantEditGuestOptionsProps = {
	onRemoveGuest?: () => void;
};
export const EditGuestOptions = ({ onRemoveGuest }: ParticipantEditGuestOptionsProps) => {
	const { editedGuest: guest, setEditedGuest: setGuest, eventId } = useEventDetailsContext();
	const { user } = useAuthenticationContext();
	const { data: me } = useSingleParticipantQuery(eventId, user.id);

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
			<SizableText>Teilnehmerschaft verwalten</SizableText>
			{me?.role === ParticipantRoleEnum.CREATOR && (
				<Button onPress={onRemoveGuest}>
					<SizableText color="$background">{guest?.firstName} aus Event ausladen</SizableText>
				</Button>
			)}
			<YStack gap="$2" />
			<SizableText>Rolle</SizableText>
			<PressableRow
				onPress={toggleRole}
				iconRight={<Checkbox onPress={toggleRole} checked={guest?.role === ParticipantRoleEnum.ADMIN} />}
				justifyContent="space-between"
			>
				<SizableText>Ist Admin</SizableText>
			</PressableRow>
		</YStack>
	);
};
