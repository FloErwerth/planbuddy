import { ChevronRight } from '@tamagui/lucide-icons';
import { SizableText, View, XStack, XStackProps } from 'tamagui';
import { Pressable } from 'react-native';
import { ReactNode } from 'react';

type PressableRowProps = {
  title: string;
  onPress?: () => void;
  icon?: ReactNode;
} & XStackProps;

export const PressableRow = ({ onPress, title, icon, ...wrapperProps }: PressableRowProps) => {
  return (
    <Pressable onPress={onPress}>
      <XStack gap="$3" alignItems="center">
        {icon}
        <View
          flex={1}
          justifyContent="space-between"
          alignItems="center"
          backgroundColor="$inputBackground"
          padding="$3"
          borderRadius="$4"
          flexDirection="row"
          {...wrapperProps}
        >
          <SizableText>{title}</SizableText>
          <ChevronRight />
        </View>
      </XStack>
    </Pressable>
  );
};
