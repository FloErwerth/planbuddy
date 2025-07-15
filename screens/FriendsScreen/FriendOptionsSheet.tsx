import { SheetProps, SizableText, View } from 'tamagui';
import { Sheet } from '@/components/tamagui/Sheet';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { useGetUser } from '@/store/user';
import { extractOtherUser } from '@/utils/extractOtherUser';
import { useCallback, useState } from 'react';
import { Dialog } from '@/components/tamagui/Dialog';
import { useRemoveFriendMutation } from '@/api/friends/addFriendsMutation';
import { SimpleFriend } from '@/api/friends/types';

type FriendOptionsProps = {
  friend: SimpleFriend;
} & SheetProps;
export const FriendOptionsSheet = ({ friend, ...props }: FriendOptionsProps) => {
  const user = useGetUser();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { mutateAsync: removeFriend } = useRemoveFriendMutation();

  const { firstName } = extractOtherUser(user!.id, friend);

  const handleDeleteFriend = useCallback(async () => {
    const success = await removeFriend(friend?.userId);
    if (success) {
      setDeleteDialogOpen(false);
      props.onOpenChange?.(false);
    }
  }, [friend?.userId, props, removeFriend]);

  return (
    <>
      <Sheet zIndex={deleteDialogOpen ? 0 : undefined} snapPoints={undefined} snapPointsMode="fit" {...props}>
        <Screen marginBottom="$4" title={`Deine Freundschaft mit ${firstName}`}>
          <Button onPress={() => setDeleteDialogOpen(true)} backgroundColor="$color.red11Light" size="$2">
            Freundschaft beenden
          </Button>
        </Screen>
        <Dialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
          <Screen>
            <SizableText>Schade, dass Du deine Freundschaft mit {firstName} beenden willst.</SizableText>
            <SizableText>Bitte bestätige noch einmal, dass dies auch wirklich dein Wunsch ist.</SizableText>
            <View gap="$2">
              <Button onPress={handleDeleteFriend} backgroundColor="$color.red11Light" size="$2">
                Freundschaft beenden
              </Button>
            </View>
          </Screen>
        </Dialog>
      </Sheet>
    </>
  );
};
