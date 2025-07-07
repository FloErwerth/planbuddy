import { DialogProps } from 'tamagui';
import { ParticipantQueryResponse } from '@/api/events/types';
import { Dialog } from '@/components/tamagui/Dialog';
import { GuestLeaveModalContent } from '@/screens/Participants/ParticipantEditSheet/Guest/GuestLeaveModalContent';
import { MeLeaveModalContent } from '@/screens/Participants/ParticipantEditSheet/Me/MeLeaveModalContent';

export type ParticipantLeaveEventModalProps = DialogProps & {
  me?: ParticipantQueryResponse;
  editedGuest?: ParticipantQueryResponse;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const ParticipantLeaveEventDialog = ({ me, editedGuest, onCancel, onConfirm, ...props }: ParticipantLeaveEventModalProps) => {
  const isMe = me?.userId === editedGuest?.userId;

  return (
    <Dialog modal={false} {...props}>
      {isMe ? (
        <MeLeaveModalContent me={me} editedGuest={editedGuest} onCancel={onCancel} />
      ) : (
        <GuestLeaveModalContent onCancel={onCancel} onConfirm={onConfirm} />
      )}
    </Dialog>
  );
};
