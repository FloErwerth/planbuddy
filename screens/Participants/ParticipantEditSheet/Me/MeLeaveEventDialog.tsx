import { CreatorContent } from "@/screens/Participants/ParticipantEditSheet/Me/CreatorContent";
import { GuestContent } from "@/screens/Participants/ParticipantEditSheet/Me/GuestContent";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { Dialog } from "@/components/tamagui/Dialog";
import { DialogProps } from "tamagui";
import { useMe } from "@/api/hooks";
import { ParticipantRoleEnum } from "@/api/participants/types";

export const MeLeaveEventDialog = (dialogProps: DialogProps) => {
	const { eventId } = useEventDetailsContext();
	const me = useMe(eventId);
	const meIsCreator = me?.role === ParticipantRoleEnum.CREATOR;

	return (
		<Dialog modal={false} {...dialogProps}>
			{meIsCreator ? <CreatorContent onOpenChange={dialogProps.onOpenChange} /> : <GuestContent onOpenChange={dialogProps.onOpenChange} />}
		</Dialog>
	);
};
