import { ChevronRight } from '@tamagui/lucide-icons';
import { View, XStack, XStackProps } from 'tamagui';
import { Pressable } from 'react-native';
import { PropsWithChildren, ReactNode } from 'react';

type PressableRowProps = {
  onPress?: () => void;
  icon?: ReactNode;
} & XStackProps &
  PropsWithChildren;

export const PressableRow = ({ onPress, icon, children, ...wrapperProps }: PressableRowProps) => {
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
          {children}
          <ChevronRight />
        </View>
      </XStack>
    </Pressable>
  );
};
