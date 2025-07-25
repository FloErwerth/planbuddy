import { SizableText, YStack } from 'tamagui';
import { PressableRow } from '@/components/PressableRow';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { ParticipantQueryResponse, Role } from '@/api/events/types';
import { Button } from '@/components/tamagui/Button';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { useMe } from '@/api/events/refiners';

type ParticipantEditGuestOptionsProps = {
    onRemoveGuest?: () => void;
};
export const EditGuestOptions = ({ onRemoveGuest }: ParticipantEditGuestOptionsProps) => {
    const { editedGuest: guest, setEditedGuest: setGuest, eventId } = useEventDetailsContext();
    const me = useMe(eventId);

    const toggleRole = () => {
        if (!guest) {
            return;
        }

        const newRole = guest.role !== Role.enum.ADMIN ? Role.enum.ADMIN : Role.enum.GUEST;

        const newGuest: ParticipantQueryResponse = {
            ...guest,
            role: newRole,
        };

        setGuest(newGuest);
    };

    return (
        <>
            <YStack gap="$2">
                <SizableText>Teilnehmerschaft verwalten</SizableText>
                {me?.role === Role.enum.CREATOR && (
                    <Button onPress={onRemoveGuest}>
                        <SizableText color="$background">{guest?.firstName} aus Event ausladen</SizableText>
                    </Button>
                )}
                <YStack gap="$2"></YStack>
                <SizableText>Rolle</SizableText>
                <PressableRow
                    onPress={toggleRole}
                    iconRight={<Checkbox onPress={toggleRole} checked={guest?.role === Role.enum.ADMIN} />}
                    justifyContent="space-between"
                >
                    <SizableText>Ist Admin</SizableText>
                </PressableRow>
            </YStack>
        </>
    );
};
