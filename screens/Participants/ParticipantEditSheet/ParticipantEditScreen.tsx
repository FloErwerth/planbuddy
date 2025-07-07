import { Screen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { useCallback, useState } from 'react';
import { useRemoveParticipantMutation, useUpdateParticipationMutation } from '@/api/events/mutations';
import { useMe } from '@/api/events/refiners';
import { EditGuestOptions } from '@/screens/Participants/ParticipantEditSheet/Guest/EditGuestOptions';
import { ParticipantEditMeOptions } from './Me/ParticipantEditMeOptions';
import { ParticipantLeaveEventDialog } from '@/screens/Participants/ParticipantEditSheet/ParticipantLeaveEventModal';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { BackButton } from '@/components/BackButton';

export const ParticipantEditScreen = () => {
  const { eventId, editedGuest, setEditedGuest } = useEventDetailsContext();

  const { mutateAsync } = useUpdateParticipationMutation();
  const { mutateAsync: remove } = useRemoveParticipantMutation();
  const me = useMe(eventId);
  const isMe = editedGuest?.userId === me?.userId;
  const [leaveEventModalOpen, setLeaveEventModalOpen] = useState(false);

  const saveEditedGuest = useCallback(async () => {
    if (!editedGuest) {
      return;
    }
    await mutateAsync({ id: editedGuest.id!, participant: { role: editedGuest.role } });
    setEditedGuest(undefined);
  }, [editedGuest, mutateAsync, setEditedGuest]);

  const removeEditedGuest = useCallback(async () => {
    setLeaveEventModalOpen(true);
  }, []);

  const onConfirmRemove = useCallback(async () => {
    if (!editedGuest || !editedGuest.id) {
      return;
    }
    await remove(editedGuest.id!);
    setEditedGuest(undefined);
  }, [editedGuest, remove, setEditedGuest]);

  return (
    <>
      <Screen back={<BackButton />} title={isMe ? 'Einladung verwalten' : 'Gast verwalten'} flex={1}>
        {isMe ? (
          <ParticipantEditMeOptions onRemoveGuest={removeEditedGuest} />
        ) : (
          <EditGuestOptions me={me} guest={editedGuest} setGuest={(guest) => setEditedGuest(guest)} onRemoveGuest={removeEditedGuest} />
        )}
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
