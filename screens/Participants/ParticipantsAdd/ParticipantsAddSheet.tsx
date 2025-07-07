import { Sheet } from '@/components/tamagui/Sheet';
import { UserSearchInput, UserSearchProvider } from '@/components/UserSearch';
import { Screen } from '@/components/Screen';
import { SheetProps } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { ParticipantsSearchResults } from '@/screens/Participants/ParticipantsAdd/ParticipantsSearchResults';

type ParticipantsAddSheetProps = { eventId: string } & SheetProps;
export const ParticipantsAddSheet = ({ eventId, ...props }: ParticipantsAddSheetProps) => {
  return (
    <Sheet unmountChildrenWhenHidden disableDrag hideHandle {...props}>
      <UserSearchProvider showFriendsWhenEmpty>
        <Screen
          title="Gäste hinzufügen"
          action={
            <Button onPress={() => props.onOpenChange?.(false)} variant="secondary" size="$2">
              Schließen
            </Button>
          }
        >
          <UserSearchInput />
        </Screen>
        <ParticipantsSearchResults onGuestsInvited={() => props.onOpenChange?.(false)} eventId={eventId} />
      </UserSearchProvider>
    </Sheet>
  );
};
