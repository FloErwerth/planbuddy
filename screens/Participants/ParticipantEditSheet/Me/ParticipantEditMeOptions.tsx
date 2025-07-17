import { SizableText, YStack } from 'tamagui';
import { Button } from '@/components/tamagui/Button';

type ParticipantEditGuestOptions = { onRemoveGuest: () => void };
export const ParticipantEditMeOptions = ({ onRemoveGuest }: ParticipantEditGuestOptions) => {
    return (
        <>
            <YStack gap="$2">
                <SizableText>Absagen</SizableText>
                <Button onPress={onRemoveGuest}>
                    <SizableText color="$background">Dem Event absagen</SizableText>
                </Button>
            </YStack>
        </>
    );
};
