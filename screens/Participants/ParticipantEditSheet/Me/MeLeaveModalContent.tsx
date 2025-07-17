import { SizableText, View } from 'tamagui';
import { ParticipantQueryResponse, Role } from '@/api/events/types';
import { router, useGlobalSearchParams } from 'expo-router';
import { useParticipantsQuery } from '@/api/events/queries';
import { Button } from '@/components/tamagui/Button';
import { useState } from 'react';
import { ParticipantLeaveEventModalProps } from '@/screens/Participants/ParticipantEditSheet/ParticipantLeaveEventModal';
import { Dialog } from '@/components/tamagui/Dialog';
import { StatusEnum } from '@/api/types';

type MeLeaveModalContentProps = {
    me?: ParticipantQueryResponse;
    editedGuest?: ParticipantQueryResponse;
} & Pick<ParticipantLeaveEventModalProps, 'onConfirm' | 'onCancel'>;
export const MeLeaveModalContent = ({ me, editedGuest, onCancel, onConfirm }: MeLeaveModalContentProps) => {
    const meIsCreator = me?.role === Role.enum.CREATOR;
    const { eventId = '' } = useGlobalSearchParams<{ eventId: string }>();
    const participants = useParticipantsQuery(eventId);
    const [chooseAdminSheetOpen, setChooseAdminSheetOpen] = useState(false);
    const hasAdmin = participants.data?.some((participant) => participant.role === Role.enum.ADMIN);
    const hasOtherGuests = participants.data?.some((participant) => {
        return participant.userId !== me?.userId && participant.status === StatusEnum.ACCEPTED;
    });

    if (meIsCreator) {
        return (
            <>
                <SizableText textAlign="center" size="$6">
                    Event absagen
                </SizableText>
                {!hasAdmin ? (
                    <>
                        <SizableText size="$4">
                            Achtung! Du bist als Creator des Events eingetragen und es gibt aktuell keinen weiteren verwaltenden Gast.
                        </SizableText>

                        {hasOtherGuests ? (
                            <SizableText textAlign="center" size="$4">
                                Bitte suche nun einen neuen Verwaltenden für das Event aus. Alternativ kannst Du das Event auch löschen.
                            </SizableText>
                        ) : (
                            <>
                                <SizableText>
                                    Leider gibt es für dieses Event noch keine weiteren Teilnehmenden, daher kannst Du das Event auch niemandem übertragen.
                                </SizableText>
                                <SizableText>
                                    Wenn Du das Event dennoch nicht absagen möchtest, dann sage Teilnehmenden bescheid, dass die Teilnahme bestätigt werden
                                    muss, um das Event übertragen zu können.
                                </SizableText>
                            </>
                        )}
                        <View gap="$2">
                            {hasOtherGuests && <Button onPress={() => router.push('/eventDetails/transferEvent')}>Neuen Verwaltenden aussuchen</Button>}
                            <Button variant={hasOtherGuests ? 'secondary' : 'primary'}>Event absagen</Button>
                            {hasOtherGuests && <SizableText textAlign="center">oder</SizableText>}
                            <Button variant="secondary" onPress={onCancel}>
                                Abbrechen
                            </Button>
                        </View>
                        <Dialog fullscreen open={chooseAdminSheetOpen} onOpenChange={setChooseAdminSheetOpen}></Dialog>
                    </>
                ) : (
                    <SizableText></SizableText>
                )}
            </>
        );
    }

    return (
        <>
            <SizableText>Me Leave</SizableText>
        </>
    );
};
