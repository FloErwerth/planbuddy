import { Screen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { useState } from 'react';
import { useDeleteParticipantMutation, useUpdateParticipationMutation } from '@/api/events/mutations';
import { useMe } from '@/api/events/refiners';
import { EditGuestOptions } from '@/screens/Participants/ParticipantEditSheet/Guest/EditGuestOptions';
import { ParticipantEditMeOptions } from './Me/ParticipantEditMeOptions';
import { ParticipantLeaveEventDialog } from '@/screens/Participants/ParticipantEditSheet/ParticipantLeaveEventModal';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { BackButton } from '@/components/BackButton';

export const ParticipantEditScreen = () => {
    const { eventId, editedGuest, setEditedGuest } = useEventDetailsContext();

    const { mutateAsync } = useUpdateParticipationMutation();
    const { mutateAsync: remove } = useDeleteParticipantMutation();
    const me = useMe(eventId);
    const isMe = editedGuest?.userId === me?.userId;
    const [leaveEventModalOpen, setLeaveEventModalOpen] = useState(false);

    const saveEditedGuest = async () => {
        if (!editedGuest) {
            return;
        }
        await mutateAsync({
            id: editedGuest.id!,
            participant: { role: editedGuest.role },
        });
        setEditedGuest(undefined);
    };

    const removeEditedGuest = async () => {
        setLeaveEventModalOpen(true);
    };

    const onConfirmRemove = async () => {
        if (!editedGuest || !editedGuest.id) {
            return;
        }
        await remove(editedGuest.id!);
        setEditedGuest(undefined);
    };

    return (
        <>
            <Screen
                back={<BackButton onPress={() => setEditedGuest(undefined)} />}
                title={isMe ? 'Einladung verwalten' : `${editedGuest?.firstName} ${editedGuest?.lastName}`}
                flex={1}
            >
                {isMe ? <ParticipantEditMeOptions onRemoveGuest={removeEditedGuest} /> : <EditGuestOptions onRemoveGuest={removeEditedGuest} />}
            </Screen>
            <Button margin="$4" onPress={saveEditedGuest}>
                Speichern
            </Button>

            <ParticipantLeaveEventDialog
                open={leaveEventModalOpen}
                onOpenChange={setLeaveEventModalOpen}
                onConfirm={onConfirmRemove}
                onCancel={() => setLeaveEventModalOpen(false)}
                me={me}
                editedGuest={editedGuest}
            />
        </>
    );
};
