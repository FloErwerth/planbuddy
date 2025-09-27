import { useMemo, useState } from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";

/*
 * Hook that stores the layout rectangle of a React Node.
 *
 * Per default only measures a React Node once.
 * Exposes options to measure consistently on every rerender.
 *
 * @returns
 * makeMeasurement: function that is passed to onLayout of a React Node.
 * measurement: the found measurements of the measured React Node.
 * */
export const useMeasureLayoutRectangle = (options?: { once: boolean }) => {
	const [rectangle, setRectangle] = useState<LayoutRectangle>({ height: 0, width: 0, y: 0, x: 0 });
	return useMemo(
		() => ({
			rectangle,
			measureRectangle: (e: LayoutChangeEvent) => {
				if (!Object.values(rectangle).every(Boolean) || (options !== undefined && !options.once)) {
					setRectangle(e.nativeEvent.layout);
				}
			},
		}),
		[rectangle, options]
	);
};
