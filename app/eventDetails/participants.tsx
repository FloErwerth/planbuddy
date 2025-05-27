import { Avatar, Separator, SizableText, View, XStack } from 'tamagui';
import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Check, Minus, UserPlus, X } from '@tamagui/lucide-icons';
import { color } from '@tamagui/themes';

export default function Participants() {
  return (
    <Screen>
      <BackButton />
      <SizableText textAlign="center" size="$8">
        Teilnehmer
      </SizableText>
      <XStack alignSelf="center" alignItems="center" gap="$4">
        <UserPlus />
        <SizableText>Weitere Teilnehmer hinzufügen</SizableText>
      </XStack>
      <SizableText>58 eingeladen Teilnehmer, 12 haben zugesagt</SizableText>
      <View justifyContent="space-between">
        <XStack justifyContent="space-between" alignItems="center">
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
            {/*Eigene Karte*/}
            <View>
              <SizableText size="$5">Florian Erwerth</SizableText>
              <SizableText size="$2">Host</SizableText>
            </View>
          </XStack>
          <Check color="green" size="$1.5" />
        </XStack>
      </View>
      <Separator borderColor="lightgrey" />

      <View justifyContent="space-between">
        <XStack justifyContent="space-between" alignItems="center">
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
            {/*Eigene Karte*/}
            <View>
              <SizableText size="$5">Florian Erwerth</SizableText>
              <SizableText size="$2">Host</SizableText>
            </View>
          </XStack>
          <Minus color={color.yellow10Light} size="$1.5" />
        </XStack>
      </View>
      <Separator borderColor="lightgrey" />
      <View justifyContent="space-between">
        <XStack justifyContent="space-between" alignItems="center">
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
            {/*Eigene Karte*/}
            <View>
              <SizableText size="$5">Florian Erwerth</SizableText>
              <SizableText size="$2">Host</SizableText>
            </View>
          </XStack>
          <X color={color.red10Light} size="$1.5" />
        </XStack>
      </View>
    </Screen>
  );
}
