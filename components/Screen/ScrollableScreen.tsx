import { Screen } from "@/components/Screen/Screen";
import type { PropsWithChildren, ReactNode } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SizableText, View, type ViewProps, XStack } from "tamagui";

export type ScrollableScreenProps = PropsWithChildren & {
	showBackButton?: boolean;
	title?: string;
	back?: ReactNode;
	action?: ReactNode;
	submit?: ReactNode;
} & ViewProps;

export const ScrollableScreen = ({ children, showBackButton = false, back, title, action, ...viewProps }: ScrollableScreenProps) => {
	const hasActionOrBack = !!back || !!action;
	const { top } = useSafeAreaInsets();

	return (
		<KeyboardAwareScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: viewProps.flex ? 1 : 0 }}>
			<Screen {...viewProps}>
				{(back || title || action) && (
					<XStack alignItems="center">
						<View flex={hasActionOrBack ? 0.2 : 0}>{back}</View>
						<View flex={1}>
							<SizableText size="$6" textAlign="center">
								{title}
							</SizableText>
						</View>
						<View flex={hasActionOrBack ? 0.2 : 0} alignItems="flex-end">
							{action}
						</View>
					</XStack>
				)}
				{children}
			</Screen>
		</KeyboardAwareScrollView>
	);
};
