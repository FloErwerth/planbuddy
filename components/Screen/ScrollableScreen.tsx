import { ScrollView } from "@/components/tamagui/ScrollView";
import { PropsWithChildren, ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SizableText, View, XStack } from "tamagui";

export type ScrollableScreenProps = PropsWithChildren & {
	showBackButton?: boolean;
	title?: string;
	back?: ReactNode;
	action?: ReactNode;
	submit?: ReactNode;
};

export const ScrollableScreen = ({ children, showBackButton = false, back, title, action }: ScrollableScreenProps) => {
	const hasActionOrBack = !!back || !!action;
	const { top } = useSafeAreaInsets();

	return (
		<ScrollView
			contentContainerStyle={{
				padding: "$4",
				gap: "$4",
				paddingTop: top || "$4",
				backgroundColor: "$background",
			}}
		>
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
		</ScrollView>
	);
};
