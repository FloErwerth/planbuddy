import { FriendSearchProvider } from '@/components/FriendSearch';
import { EventCreationAddFriends } from '@/screens/EventCreation/EventCreationAddFriends';
import { Sheet } from '@/components/tamagui/Sheet';
import { SheetProps } from 'tamagui';

export const AddFriendModal = (props: SheetProps) => {
  return (
    <Sheet modal={false} hideHandle animation="quick" unmountChildrenWhenHidden open={props.open} onOpenChange={props.onOpenChange}>
      <FriendSearchProvider>
        <EventCreationAddFriends onClose={() => props.onOpenChange?.(false)} />
      </FriendSearchProvider>
    </Sheet>
  );
};
