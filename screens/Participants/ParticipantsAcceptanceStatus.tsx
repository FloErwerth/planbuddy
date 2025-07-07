import { SizableText, View } from 'tamagui';
import { Status, StatusEnum } from '@/api/types';

type AcceptanceStatusProps = {
  status: Status;
};

export const ParticipantsAcceptanceStatus = ({ status }: AcceptanceStatusProps) => {
  if (status === StatusEnum.ACCEPTED) {
    return null;
  }

  if (status === StatusEnum.PENDING) {
    return (
      <View padding="$2" borderRadius="$12" backgroundColor="$color.yellow5Light">
        <SizableText size="$1">Ausstehend</SizableText>
      </View>
    );
  }

  if (status === StatusEnum.DECLINED) {
    return (
      <View padding="$1.5" borderRadius="$12" backgroundColor="$color.red8Light">
        <SizableText size="$2">Abgelehnt</SizableText>
      </View>
    );
  }
};
