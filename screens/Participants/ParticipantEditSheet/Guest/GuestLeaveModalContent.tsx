import { SizableText, View } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { ParticipantLeaveEventModalProps } from '@/screens/Participants/ParticipantEditSheet/ParticipantLeaveEventModal';

export const GuestLeaveModalContent = ({ onCancel, onConfirm }: Pick<ParticipantLeaveEventModalProps, 'onConfirm' | 'onCancel'>) => {
    return (
        <>
            <SizableText textAlign="center" size="$6">
                Event absagen
            </SizableText>

            <SizableText size="$5">Bitte bestätige uns noch einmal, dass Du aus dem Event absagen möchtest.</SizableText>
            <View gap="$2">
                <Button size="$3" onPress={onConfirm}>
                    Absagen
                </Button>
                <Button size="$3" variant="secondary" onPress={onCancel}>
                    Abbrechen
                </Button>
            </View>
        </>
    );
};
