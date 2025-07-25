import { Role } from '@/api/events/types';
import { CreatorContent } from '@/screens/Participants/ParticipantEditSheet/Me/CreatorContent';
import { GuestContent } from '@/screens/Participants/ParticipantEditSheet/Me/GuestContent';
import { useMe } from '@/api/events/refiners';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { Dialog } from '@/components/tamagui/Dialog';
import { DialogProps } from 'tamagui';

export const MeLeaveEventDialog = (dialogProps: DialogProps) => {
    const { eventId } = useEventDetailsContext();
    const me = useMe(eventId);
    const meIsCreator = me?.role === Role.enum.CREATOR;

    return (
        <Dialog modal={false} {...dialogProps}>
            {meIsCreator ? <CreatorContent onOpenChange={dialogProps.onOpenChange} /> : <GuestContent onOpenChange={dialogProps.onOpenChange} />}
        </Dialog>
    );
};
