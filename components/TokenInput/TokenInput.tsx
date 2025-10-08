import { TextInputOTP, TextInputOTPSlot, TextInputOTPGroup, TextInputOTPSeparator, type TextInputOTPSlotProps } from "react-native-input-code-otp";
import { getTokenValue, type Token, useTheme } from "tamagui";

type OTPInputProps = {
	onFilled: (code: string) => void;
	showErrorColors?: boolean;
};

const StyledTextInputOTPSlot = (props: TextInputOTPSlotProps & Pick<OTPInputProps, "showErrorColors">) => {
	const { primary, color, accent } = useTheme({ name: props.showErrorColors ? "error" : "default" });
	const focusStyle = {
		borderColor: primary?.val,
		borderWidth: getTokenValue("$1" as Token),
		backgroundColor: getTokenValue("$backgroundFocus" as Token),
		fontWeight: 700,
		height: 50,
	} as const;

	const slotStyles = {
		borderColor: accent?.val,
	} as const;

	const slotTextStyles = {
		fontSize: 18,
		color: color?.val,
	} as const;

	const focusedSlotTextStyles = {
		fontWeight: 700,
		fontSize: 18,
		color: color?.val,
	} as const;

	return (
		<TextInputOTPSlot
			focusable
			slotStyles={slotStyles}
			slotTextStyles={slotTextStyles}
			focusedSlotTextStyles={focusedSlotTextStyles}
			focusedSlotStyles={focusStyle}
			{...props}
		/>
	);
};

export const TokenInput = ({ onFilled, showErrorColors }: OTPInputProps) => {
	return (
		<TextInputOTP maxLength={6} onFilled={onFilled}>
			<TextInputOTPGroup>
				<StyledTextInputOTPSlot index={0} showErrorColors={showErrorColors} />
				<StyledTextInputOTPSlot index={1} showErrorColors={showErrorColors} />
				<StyledTextInputOTPSlot index={2} showErrorColors={showErrorColors} />
			</TextInputOTPGroup>
			<TextInputOTPSeparator />
			<TextInputOTPGroup>
				<StyledTextInputOTPSlot index={3} showErrorColors={showErrorColors} />
				<StyledTextInputOTPSlot index={4} showErrorColors={showErrorColors} />
				<StyledTextInputOTPSlot index={5} showErrorColors={showErrorColors} />
			</TextInputOTPGroup>
		</TextInputOTP>
	);
};
