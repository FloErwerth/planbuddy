import { XStack, XStackProps } from "tamagui";
import { Pressable } from "react-native";
import { PropsWithChildren, ReactNode } from "react";
import { Card } from "@/components/tamagui/Card";

type PressableRowProps = {
	onPress?: () => void;
	icon?: ReactNode;
	iconRight?: ReactNode;
} & XStackProps &
	PropsWithChildren;

export const PressableRow = ({ onPress, icon, iconRight, children, ...wrapperProps }: PressableRowProps) => {
	const IconRight = () => {
		if (!iconRight) {
			return null;
		}

		return iconRight;
	};

	return (
		<Pressable onPress={onPress}>
			<XStack gap="$3" alignItems="center">
				{icon}
				<Card flex={1} justifyContent="space-between" alignItems="center" padding="$3" borderRadius="$4" flexDirection="row" {...wrapperProps}>
					{children}
					<IconRight />
				</Card>
			</XStack>
		</Pressable>
	);
};
