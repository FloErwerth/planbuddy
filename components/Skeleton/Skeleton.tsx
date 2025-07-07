import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from 'react-native-reanimated';
import { PropsWithChildren, useEffect } from 'react';

export const Skeleton = ({ children }: PropsWithChildren) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      Math.random() * 250,
      withRepeat(
        withTiming(1, {
          duration: 750,
        }),
        -1,
        true
      )
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View layout={FadeIn} entering={FadeIn} style={style}>
      {children}
    </Animated.View>
  );
};
