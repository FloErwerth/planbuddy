import { Input as TamaguiInput, styled } from "tamagui";

export const Input = styled(TamaguiInput, {
	color: "$color",
	fontWeight: 400,
	borderWidth: "$1",
	backgroundColor: "$accent",
	focusStyle: {
		borderColor: "$primary",
		borderWidth: "$1",
		backgroundColor: "$backgroundFocus",
		color: "$primary",
		fontWeight: 700,
	},
	placeholderTextColor: "$placeholderColor",
});
