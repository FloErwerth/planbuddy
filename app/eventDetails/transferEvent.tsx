import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { useParticipantsQuery } from '@/api/events/queries';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { useCallback, useMemo, useState } from 'react';
import { Participant } from '@/screens/Participants/Participant';
import { StatusEnum } from '@/api/types';
import { useMe } from '@/api/events/refiners';
import { SizableText, View } from 'tamagui';
import { Pressable } from 'react-native';
import { useRemoveParticipantMutation, useUpdateParticipationMutation } from '@/api/events/mutations';
import { ParticipantQueryResponse, Role } from '@/api/events/types';
import { router } from 'expo-router';
import { Dialog } from '@/components/tamagui/Dialog';
import { Button } from '@/components/tamagui/Button';

export default function TransferEvent() {
  const { eventId } = useEventDetailsContext();
  const participants = useParticipantsQuery(eventId, [StatusEnum.ACCEPTED]);
  const me = useMe(eventId);
  const { mutateAsync: updateGuest } = useUpdateParticipationMutation();
  const { mutateAsync: removeGuest } = useRemoveParticipantMutation();
  const [guestToTransferTo, setGuestToTransferTo] = useState<ParticipantQueryResponse | undefined>(undefined);

  const handleTransferEvent = useCallback(async () => {
    if (!me.id || !guestToTransferTo || !guestToTransferTo.id) {
      return;
    }
    await updateGuest({
      id: guestToTransferTo?.id,
      participant: { eventId, status: guestToTransferTo?.status, userId: guestToTransferTo?.userId, role: Role.enum.ADMIN },
    });
    await removeGuest(me.id);
    setGuestToTransferTo(undefined);
    router.replace('(tabs)');
  }, [eventId, guestToTransferTo, me, removeGuest, updateGuest]);

  const mappedParticipants = useMemo(
    () =>
      participants.data
        ?.filter((guest) => {
          if (!guest || !me) {
            return true;
          }
          return guest?.userId !== me?.userId;
        })
        .map((participant) => {
          if (!participant.id) {
            return null;
          }
          return (
            <Pressable
              key={participant.id}
              onPress={async () => {
                setGuestToTransferTo(participant);
              }}
            >
              <Participant participant={participant} />
            </Pressable>
          );
        }),
    [me, participants?.data]
  );

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
      <ScrollView withShadow contentContainerStyle={{ padding: '$4', gap: '$2' }}>
        {mappedParticipants}
      </ScrollView>
    </>
  );
}
