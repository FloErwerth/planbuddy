import type { ComponentProps } from "react";
import { Button as TamaguiButton, debounce, styled } from "tamagui";

const StyledButton = styled(TamaguiButton, {
	pressStyle: {
		opacity: 0.85,
	},
	variants: {
		variant: {
			primary: {
				backgroundColor: "$primary",
				color: "$background",
			},
			secondary: {
				backgroundColor: "$accent",
				color: "$primary",
			},
			transparent: {
				padding: 0,
				backgroundColor: "transparent",
			},
			round: {
				backgroundColor: "$accent",
				width: "$3",
				height: "$3",
				padding: 0,
			},
		},
		disabled: {
			true: {
				backgroundColor: "$color.gray6Light",
				borderColor: "$color.gray8Light",
				borderWidth: 1,
				color: "$color.gray9Light",
				elevation: 0,
			},
		},
	},
	defaultVariants: {
		variant: "primary",
	},
});

type ButtonProps = ComponentProps<typeof StyledButton> & { debounceDisabled?: boolean };
export const Button = ({ onPress, debounceDisabled = false, ...props }: ButtonProps) => {
	const onPressDebounced = (onPress && (!debounceDisabled ? debounce(onPress, 200, true) : onPress)) || undefined;
	return <StyledButton {...props} onPress={onPressDebounced} />;
};
