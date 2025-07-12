import { PropsWithChildren, ReactNode } from 'react';
import { SizableText, View, ViewProps, XStack } from 'tamagui';

type ScreenProps = PropsWithChildren &
  ViewProps & {
    back?: ReactNode;
    title?: string;
    action?: ReactNode;
  };

export const Screen = ({ children, back = false, title, action, ...props }: ScreenProps) => {
  return (
    <View padding="$4" gap="$4" backgroundColor="$background" {...props}>
      {(back || title || action) && (
        <XStack alignItems="center">
          <View flex={0.5}>{back}</View>
          <View flex={1}>
            <SizableText size="$6" textAlign="center">
              {title}
            </SizableText>
          </View>
          <View flex={0.5} alignItems="flex-end">
            {action}
          </View>
        </XStack>
      )}
      {children}
    </View>
  );
};
