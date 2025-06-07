import { PropsWithChildren, ReactNode } from 'react';
import { SizableText, View, XStack } from 'tamagui';
import { BackButton } from '@/components/BackButton';
import { router } from 'expo-router';
import { ScrollView } from '@/components/tamagui/ScrollView';

type ScreenProps = PropsWithChildren & {
  showBackButton?: boolean;
  title?: string;
  action?: ReactNode;
  submit?: ReactNode;
};

export const ScrollableScreen = ({
  children,
  showBackButton = false,
  title,
  action,
}: ScreenProps) => {
  return (
    <ScrollView
      contentContainerStyle={{
        padding: '$4',
        gap: '$4',
        backgroundColor: '$background',
      }}
    >
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
    </ScrollView>
  );
};
