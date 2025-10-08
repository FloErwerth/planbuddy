import { useEffect, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { View, type ViewProps } from "tamagui";

type HeightTransitionProps = {
	open: boolean;
	enableHeightChange?: boolean;
} & Omit<ViewProps, "position" | "onLayout">;

const ANIMATION_DURATION = 200;

export const HeightTransition = ({ children, open, enableHeightChange = true, ...viewProps }: HeightTransitionProps) => {
	const [containerHeight, setContainerHeight] = useState<number>();
	const [renderChildren, setRenderChildren] = useState(false);
	const [shouldCheckHeightChange, setShouldCheckHeightChange] = useState(false);

	const measureContainer = (measurement: LayoutChangeEvent) => {
		if (containerHeight !== undefined && !(enableHeightChange && shouldCheckHeightChange)) {
			return;
		}
		setContainerHeight(measurement.nativeEvent.layout.height);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: this would lead to infinite re-renders
	useEffect(() => {
		if (open) {
			setRenderChildren(true);
			if (enableHeightChange) {
				setTimeout(() => {
					setShouldCheckHeightChange(true);
				}, ANIMATION_DURATION);
			}
		} else {
			if (enableHeightChange) {
				setShouldCheckHeightChange(false);
			}
			setTimeout(() => {
				setContainerHeight(undefined);
				setRenderChildren(false);
			}, ANIMATION_DURATION);
		}
	}, [open]);

	const heightTransitionStyle = useAnimatedStyle(() => ({
		height: withTiming(containerHeight && open ? containerHeight : 0, { duration: ANIMATION_DURATION }),
		opacity: withTiming(containerHeight && open ? 1 : 0, { duration: ANIMATION_DURATION }),
		overflow: "hidden",
	}));

	if (!renderChildren) {
		return null;
	}

	return (
		<Animated.View style={heightTransitionStyle}>
			<View position={!containerHeight ? "absolute" : undefined} onLayout={measureContainer} {...viewProps}>
				{children}
			</View>
		</Animated.View>
	);
};
