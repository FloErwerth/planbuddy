import { useEffect, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { View, ViewProps } from 'tamagui';

type HeightTransitionProps = {
    open: boolean;
} & Omit<ViewProps, 'position' | 'onLayout'>;

export const HeightTransition = ({ children, open, ...viewProps }: HeightTransitionProps) => {
    const [containerHeight, setContainerHeight] = useState<number>();

    const measureContainer = (measurement: LayoutChangeEvent) => {
        if (containerHeight) {
            return;
        }
        setContainerHeight(measurement.nativeEvent.layout.height);
    };

    useEffect(() => {
        if (!open) {
            setTimeout(() => setContainerHeight(undefined), 200);
        }
    }, [open]);

    const heightTransitionStyle = useAnimatedStyle(() => ({
        height: withTiming(containerHeight && open ? containerHeight : 0, { duration: 200 }),
        overflow: 'hidden',
    }));

    return (
        <Animated.View style={heightTransitionStyle}>
            <View position={!containerHeight ? 'absolute' : undefined} onLayout={measureContainer} {...viewProps}>
                {children}
            </View>
        </Animated.View>
    );
};
