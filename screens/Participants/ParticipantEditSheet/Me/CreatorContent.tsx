import { router } from "expo-router";
import { useState } from "react";
import { type DialogProps, SizableText, View } from "tamagui";
import { useDeleteEventMutation } from "@/api/events/deleteEvent";
import { useMe } from "@/api/hooks";
import { useAllParticipantsFromEventQuery } from "@/api/participants/allParticipants/useAllParticipantsFromEventQuery";
import { ParticipantRoleEnum, ParticipantStatusEnum } from "@/api/participants/types";
import { Button } from "@/components/tamagui/Button";
import { Dialog } from "@/components/tamagui/Dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";

type CreatorContentProps = Pick<DialogProps, "onOpenChange">;

export const CreatorContent = ({ onOpenChange }: CreatorContentProps) => {
	const { eventId } = useEventDetailsContext();
	const me = useMe(eventId);
	const participants = useAllParticipantsFromEventQuery(eventId);
	const hasAdmin = participants.data?.some((participant) => participant.role === ParticipantRoleEnum.ADMIN);
	const hasOtherGuests = participants.data?.some((participant) => {
		return participant.userId !== me?.userId && participant.status === ParticipantStatusEnum.ACCEPTED;
	});
	const [chooseAdminSheetOpen, setChooseAdminSheetOpen] = useState(false);
	const { t } = useTranslation();

	const { mutateAsync: deleteEvent } = useDeleteEventMutation();

	const handleDeleteEvent = async () => {
		await deleteEvent(eventId);
	};

	return (
		<>
			<SizableText textAlign="center" size="$6">
				{t("events.leave")}
			</SizableText>
			{!hasAdmin ? (
				<>
					<SizableText size="$4">{t("creator.warningNoAdmin")}</SizableText>

					{hasOtherGuests ? (
						<SizableText textAlign="center" size="$4">
							{t("creator.transferOrDelete")}
						</SizableText>
					) : (
						<>
							<SizableText>{t("creator.noOtherGuests")}</SizableText>
							<SizableText>{t("creator.notifyGuests")}</SizableText>
							<SizableText>{t("creator.canStillDelete")}</SizableText>
						</>
					)}
					<View gap="$2">
						{hasOtherGuests && <Button onPress={() => router.push("/eventDetails/transferEvent")}>{t("creator.chooseNewAdmin")}</Button>}
						<Button onPress={handleDeleteEvent} variant={hasOtherGuests ? "secondary" : "primary"}>
							{t("events.delete")}
						</Button>
						{hasOtherGuests && <SizableText textAlign="center">{t("common.or")}</SizableText>}
						<Button variant="secondary" onPress={() => onOpenChange?.(false)}>
							{t("common.cancel")}
						</Button>
					</View>
					<Dialog fullscreen open={chooseAdminSheetOpen} onOpenChange={setChooseAdminSheetOpen} />
				</>
			) : (
				<SizableText />
			)}
		</>
	);
};
