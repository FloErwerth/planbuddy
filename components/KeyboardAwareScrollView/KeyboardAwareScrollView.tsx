import { createContext, type ForwardedRef, forwardRef, useContext } from "react";
import {
	// eslint-disable-next-line no-restricted-imports
	KeyboardAwareScrollView as RNKeyboardAwareScrollView,
	type KeyboardAwareScrollViewProps as RNKeyboardAwareScrollViewProps,
} from "react-native-keyboard-controller";
// eslint-disable-next-line no-restricted-imports
import type { ScrollView } from "react-native";
import { styled } from "tamagui";

const KeyboardAwareContext = createContext({});

const KeyboardAwareScrollViewUnstyled = forwardRef(({ children, ...props }: RNKeyboardAwareScrollViewProps, ref: ForwardedRef<ScrollView>) => (
	<KeyboardAwareContext.Provider value={{}}>
		<RNKeyboardAwareScrollView showsVerticalScrollIndicator={false} ref={ref} {...props}>
			{children}
		</RNKeyboardAwareScrollView>
	</KeyboardAwareContext.Provider>
));

KeyboardAwareScrollViewUnstyled.displayName = "KeyboardAwareScrollView";

export const useKeyboardAwareScrollView = () => {
	const context = useContext(KeyboardAwareContext);

	if (!context) {
		throw Error(
			"The useKeyboardAwareScrollView hook must be used within the KeyboardAwareContext. " +
				"This does mean that you used a component that should be within a KeyboardAwareScrollView but isn't.",
		);
	}
};

export const KeyboardAwareScrollView = styled(KeyboardAwareScrollViewUnstyled);
