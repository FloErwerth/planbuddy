import { PropsWithChildren, ReactNode } from 'react';
import { SizableText, View, ViewProps, XStack } from 'tamagui';
import { BackButton } from '@/components/BackButton';
import { router } from 'expo-router';

type ScreenProps = PropsWithChildren &
  ViewProps & {
    showBackButton?: boolean;
    title?: string;
    action?: ReactNode;
  };

export const Screen = ({
  children,
  showBackButton = false,
  title,
  action,
  ...props
}: ScreenProps) => {
  return (
    <View padding="$4" gap="$4" backgroundColor="$background" {...props}>
      <XStack alignItems="center">
        <View flex={0.5}>{showBackButton && router.canGoBack() ? <BackButton /> : <View />}</View>
        <View flex={1}>
          <SizableText size="$6" textAlign="center">
            {title}
          </SizableText>
        </View>
        <View flex={0.5} alignItems="flex-end">
          {action}
        </View>
      </XStack>
      {children}
    </View>
  );
};
