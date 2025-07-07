import { SizableText, View } from 'tamagui';
import { Status, StatusEnum } from '@/api/types';
import { Ellipsis } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';

type AcceptanceStatusProps = {
  status: Status;
  openOptions: () => void;
};

export const FriendAcceptanceStatus = ({ status, openOptions }: AcceptanceStatusProps) => {
  if (status === StatusEnum.ACCEPTED) {
    return (
      <View>
        <Pressable onPress={openOptions}>
          <Ellipsis />
        </Pressable>
      </View>
    );
  }

  if (status === StatusEnum.PENDING) {
    return (
      <View padding="$2" borderRadius="$12" backgroundColor="$color.yellow8Light">
        <SizableText size="$2">Ausstehend</SizableText>
      </View>
    );
  }

  if (status === StatusEnum.DECLINED) {
    return (
      <View padding="$2" borderRadius="$12" backgroundColor="$color.red8Light">
        <SizableText size="$2">Abgelehnt</SizableText>
      </View>
    );
  }
};
