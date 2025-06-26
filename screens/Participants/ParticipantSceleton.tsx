import { Circle, Square, View, XStack } from 'tamagui';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export const ParticipantSceleton = () => {
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

  const squareStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View layout={FadeIn} style={squareStyle}>
      <Square
        justifyContent="space-between"
        padding="$2"
        borderRadius="$4"
        backgroundColor="$inputBackground"
        alignItems="center"
      >
        <XStack gap="$4" alignItems="center">
          <Animated.View style={squareStyle}>
            <Circle size="$4" backgroundColor="$color.gray9Light" />
          </Animated.View>
          <View flex={1} gap="$2">
            <Animated.View style={squareStyle}>
              <Square
                width="50%"
                borderRadius="$2"
                backgroundColor="$color.gray10Light"
                height="$1"
              />
            </Animated.View>
            <Animated.View style={squareStyle}>
              <Square
                width="35%"
                borderRadius="$2"
                backgroundColor="$color.gray9Light"
                height="$0.75"
              />
            </Animated.View>
          </View>
        </XStack>
      </Square>
    </Animated.View>
  );
};
