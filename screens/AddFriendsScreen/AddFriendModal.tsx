import { UserSearchProvider } from '@/components/UserSearch';
import { EventCreationAddFriends } from '@/screens/EventCreation/EventCreationAddFriends';
import { Sheet } from '@/components/tamagui/Sheet';
import { SheetProps } from 'tamagui';

export const AddFriendModal = (props: SheetProps) => {
    return (
        <Sheet modal={false} hideHandle animation="quick" unmountChildrenWhenHidden open={props.open} onOpenChange={props.onOpenChange}>
            <UserSearchProvider showUsersWhenEmpty>
                <EventCreationAddFriends onClose={() => props.onOpenChange?.(false)} />
            </UserSearchProvider>
        </Sheet>
    );
};
