import { Avatar, SizableText, View, XStack } from 'tamagui';
import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';

export default function Hosts() {
  return (
    <Screen>
      <BackButton />
      <SizableText textAlign="center" size="$8">
        Dein Host
      </SizableText>
      <View justifyContent="space-between" flex={1}>
        <XStack gap="$4" alignItems="center">
          <Avatar circular size="$4" elevationAndroid={4}>
            <Avatar.Image src="http://some" />
            <Avatar.Fallback
              backgroundColor="$background"
              alignItems="center"
              justifyContent="center"
            >
              <SizableText>F.E</SizableText>
            </Avatar.Fallback>
          </Avatar>
          <SizableText size="$6">Florian Erwerth</SizableText>
        </XStack>
      </View>
    </Screen>
  );
}
