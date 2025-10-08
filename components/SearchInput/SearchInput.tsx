import { Button } from "@/components/tamagui/Button";
import { Input } from "@/components/tamagui/Input";
import { X } from "@tamagui/lucide-icons";
import { useRef, useState } from "react";
import { debounce, type InputProps, View, type Input as InputTamagui } from "tamagui";

type SearchInputProps = Omit<InputProps, "onChangeText"> & {
	onChangeText: (text: string) => void;
};
export const SearchInput = ({ onChangeText, ...props }: SearchInputProps) => {
	const [hasValue, setHasValue] = useState(false);
	const inputRef = useRef<InputTamagui>(null);

	const handleClear = () => {
		setHasValue(false);
		onChangeText("");
		inputRef.current?.clear();
	};

	return (
		<View>
			<Input ref={inputRef} {...props} onChange={(e) => setHasValue(!!e.nativeEvent.text)} onChangeText={debounce(onChangeText, 300)} />
			{hasValue && (
				<Button variant="round" paddingVertical="$0" position="absolute" top="$1.5" right="$1.5" onPress={handleClear}>
					<X size="$1" />
				</Button>
			)}
		</View>
	);
};
