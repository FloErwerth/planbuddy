import { SizableText, YStack } from "tamagui";
import { PressableRow } from "@/components/PressableRow";
import { Checkbox } from "@/components/tamagui/Checkbox";
import { Button } from "@/components/tamagui/Button";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant";
import { useGetUser } from "@/store/authentication";
import { Participant, ParticipantRoleEnum } from "@/api/participants/types";
import { User } from "@/api/user/types";

type ParticipantEditGuestOptionsProps = {
	onRemoveGuest?: () => void;
};
export const EditGuestOptions = ({ onRemoveGuest }: ParticipantEditGuestOptionsProps) => {
	const { editedGuest: guest, setEditedGuest: setGuest, eventId } = useEventDetailsContext();
	const user = useGetUser();
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
		<>
			<YStack gap="$2">
				<SizableText>Teilnehmerschaft verwalten</SizableText>
				{me?.role === ParticipantRoleEnum.CREATOR && (
					<Button onPress={onRemoveGuest}>
						<SizableText color="$background">{guest?.firstName} aus Event ausladen</SizableText>
					</Button>
				)}
				<YStack gap="$2"></YStack>
				<SizableText>Rolle</SizableText>
				<PressableRow
					onPress={toggleRole}
					iconRight={<Checkbox onPress={toggleRole} checked={guest?.role === ParticipantRoleEnum.enum.ADMIN} />}
					justifyContent="space-between"
				>
					<SizableText>Ist Admin</SizableText>
				</PressableRow>
			</YStack>
		</>
	);
};
