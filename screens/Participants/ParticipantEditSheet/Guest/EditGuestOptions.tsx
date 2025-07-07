import { SizableText, YStack } from 'tamagui';
import { PressableRow } from '@/components/PressableRow';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { ParticipantQueryResponse, Role } from '@/api/events/types';
import { Button } from '@/components/tamagui/Button';
import { useCallback } from 'react';

type ParticipantEditGuestOptionsProps = {
  me: ParticipantQueryResponse;
  guest?: ParticipantQueryResponse;
  onRemoveGuest?: () => void;
  setGuest: (guest: ParticipantQueryResponse) => void;
};
export const EditGuestOptions = ({ me, guest, setGuest, onRemoveGuest }: ParticipantEditGuestOptionsProps) => {
  const toggleRole = useCallback(() => {
    if (!guest) {
      return;
    }

    const newGuest: ParticipantQueryResponse = {
      ...guest,
      role: guest.role === Role.enum.GUEST ? Role.enum.ADMIN : Role.enum.GUEST,
    };

    setGuest(newGuest);
  }, [guest, setGuest]);

  return (
    <>
      <YStack gap="$2">
        <SizableText>Rolle</SizableText>
        <PressableRow onPress={toggleRole} iconRight={null} justifyContent="space-between">
          <SizableText>Ist Admin</SizableText>
          <Checkbox checked={guest?.role === Role.enum.ADMIN} />
        </PressableRow>
      </YStack>
      <YStack gap="$2">
        <SizableText>Ausladen</SizableText>
        {me?.role === Role.enum.CREATOR && (
          <Button onPress={onRemoveGuest}>
            <SizableText color="$background">{guest?.firstName} aus Event ausladen</SizableText>
          </Button>
        )}
      </YStack>
    </>
  );
};
