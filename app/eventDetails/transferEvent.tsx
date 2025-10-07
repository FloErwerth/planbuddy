import { Screen } from "@/components/Screen";
import { BackButton } from "@/components/BackButton";
import { useEventDetailsContext } from "@/screens/EventDetails/EventDetailsProvider";
import { ScrollView } from "@/components/tamagui/ScrollView";
import { useState } from "react";
import { SizableText, View } from "tamagui";
import { router } from "expo-router";
import { Dialog } from "@/components/tamagui/Dialog";
import { Button } from "@/components/tamagui/Button";
import { useSearchParticipantsByStatus } from "@/api/participants/searchParticipantsByNameStatus/useSearchParticipantsByStatus";
import { useUpdateParticipationMutation } from "@/api/participants/updateParticipant/useUpdateParticipantMutation";
import { useUpdateEventMutation } from "@/api/events/updateEvent/useUpdateEventMutation";
import { useDeleteParticipantMutation } from "@/api/participants/deleteParticipant/useDeleteParticipantMutation";
import { useSingleParticipantQuery } from "@/api/participants/singleParticipant/useSingleParticipant";
import { useGetUser } from "@/store/authentication";
import { Participant, ParticipantRoleEnum, ParticipantStatusEnum } from "@/api/participants/types";
import { ParticipantRow } from "@/screens/Participants/Participant";
import { User } from "@/api/user/types";

export default function TransferEvent() {
  const user = useGetUser();
  const { eventId } = useEventDetailsContext();
  const { data: myEvent } = useSingleParticipantQuery(eventId, user.id);
  const { data: participatingUsers } = useSearchParticipantsByStatus(eventId, [ParticipantStatusEnum.ACCEPTED]);
  const { mutateAsync: updateGuest } = useUpdateParticipationMutation();
  const { mutateAsync: updateEvent } = useUpdateEventMutation();
  const { mutateAsync: removeGuest } = useDeleteParticipantMutation();
  const [guestToTransferTo, setGuestToTransferTo] = useState<(Participant & User) | undefined>(undefined);

  const handleTransferEvent = async () => {
    try {
      if (!guestToTransferTo || !guestToTransferTo.id || !myEvent || myEvent.userId) {
        return;
      }
      setGuestToTransferTo(undefined);
      await updateEvent({
        id: eventId,
        creatorId: guestToTransferTo.userId,
      });
      await updateGuest({
        id: guestToTransferTo?.id,
        role: ParticipantRoleEnum.CREATOR,
      });
      await removeGuest(myEvent.userId);
      router.push("/(tabs)");
    } catch (e) {
      console.error(e);
      router.back();
    }
  };

  const mappedParticipants = participatingUsers?.map((participatingUser) => {
    if (!participatingUser.id) {
      return null;
    }
    return (
      <ParticipantRow
        key={participatingUser.id}
        onOpenOptions={() => setGuestToTransferTo(participatingUser)}
        showEllipsis={false}
        showStatus={false}
        participatingUser={participatingUser}
      />
    );
  });

  return (
    <>
      <Screen back={<BackButton />} title="Event übertragen">
        <SizableText>Suche dir nun jemanden aus, der das Event von nun an Leiten wird.</SizableText>
      </Screen>
      <Dialog modal={false} open={!!guestToTransferTo} onOpenChange={() => setGuestToTransferTo(undefined)}>
        <SizableText size="$5">Möchtest Du {guestToTransferTo?.firstName} das Event übertragen?</SizableText>
        <View gap="$2">
          <Button onPress={handleTransferEvent}>
            <SizableText color="$background">An {guestToTransferTo?.firstName} übertragen</SizableText>
          </Button>
          <Button variant="secondary" onPress={() => setGuestToTransferTo(undefined)}>
            Abbrechen
          </Button>
        </View>
      </Dialog>
      <ScrollView withShadow contentContainerStyle={{ padding: "$4", gap: "$2" }}>
        {mappedParticipants}
      </ScrollView>
    </>
  );
}
