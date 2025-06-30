import { IconProps } from '@tamagui/helpers-icon';
import { ReactNode } from 'react';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Button } from '@/components/tamagui/Button';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

export type TabBarIconProps = {
  Icon: (props: IconProps) => ReactNode;
  Notification?: ReactNode;
  scale?: number;
  title?: string;
} & BottomTabBarButtonProps;

export const TabBarIcon = ({ Icon, title, scale = 1, Notification, ...props }: TabBarIconProps) => {
  const focused = props.accessibilityState?.selected ?? false;

  const iconStyle = useAnimatedStyle(() => ({
    left: -1,
    transform: [{ scale: withTiming(focused ? scale + 0.2 : scale, { duration: 150 }) }],
  }));

  return (
    <Button
      variant="transparent"
      top="$2"
      backgroundColor="transparent"
      flex={1}
      onPress={props.onPress}
    >
      <Animated.View style={iconStyle}>
        <Icon color={focused ? '$primary' : '$color'} />
      </Animated.View>
      {Notification}
    </Button>
  );
};
