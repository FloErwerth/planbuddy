import { Input } from "@/components/tamagui/Input";
import { useRef } from "react";
import { NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";
import { XStack, Input as InputTamagui } from "tamagui";

type OTPInputProps = {
	value: string[];
	onChange: (value: string[]) => void;
	length?: number;
	disabled?: boolean;
};

export const TokenInput = ({ value, onChange, length = 6, disabled = false }: OTPInputProps) => {
	const inputRefs = useRef<InputTamagui[]>([]);
	const focusInput = (index: number) => {
		if (inputRefs.current[index]) {
			inputRefs.current[index].focus();
		}
	};

	const handleChange = (text: string, index: number) => {
		const newValue = [...value];
		newValue[index] = text;
		onChange(newValue);

		if (text && index < length - 1) {
			focusInput(index + 1);
		}
	};

	const handleKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
		if (event.nativeEvent.key === "Backspace" && index > 0) {
			handleChange("", index);
			focusInput(index - 1);
		}
	};

	return (
		<XStack justifyContent="center" gap="$2">
			{Array(length)
				.fill(0)
				.map((_, index) => {
					return (
						<Input
							key={index}
							ref={(ref) => {
								if (!ref) {
									return;
								}
								inputRefs.current[index] = ref;
							}}
							autoFocus={index === 0}
							onPress={() => inputRefs.current[index].setSelection(0, 1)}
							onFocus={() => inputRefs.current[index].setSelection(0, 1)}
							textAlign="center"
							maxLength={1}
							size="$5"
							fontWeight="bold"
							focusStyle={{
								fontWeight: "bold",
							}}
							keyboardType="number-pad"
							onChangeText={(text) => handleChange(text, index)}
							onKeyPress={(event) => handleKeyPress(event, index)}
							value={value[index]}
							editable={!disabled}
							selectTextOnFocus
						/>
					);
				})}
		</XStack>
	);
};
