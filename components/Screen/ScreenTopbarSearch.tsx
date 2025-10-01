import { Input } from "@/components/tamagui/Input";
import { useRef, useState } from "react";
import { AnimatePresence, debounce, getTokenValue, InputProps, Token, View } from "tamagui";
import { Search, X } from "@tamagui/lucide-icons";
import { TextInput, useWindowDimensions } from "react-native";
import { Button } from "@/components/tamagui/Button";
import { useSetTimeout } from "@/hooks/useSetTimeout";

type SearchInputProps = Omit<InputProps, "onChangeText"> & {
	onChangeText: (text: string) => void;
	top?: number;
};
export const ScreenTopbarSearch = ({ onChangeText, top, ...props }: SearchInputProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { width } = useWindowDimensions();
	const inputRef = useRef<TextInput>(null);
	const { setTimeout } = useSetTimeout();

	const paddingRightValue = getTokenValue("$4" as Token, "space");

	const handleToggleInput = () => {
		setIsOpen((open) => {
			if (open) {
				return false;
			} else {
				return true;
			}
		});
	};
	return (
		<>
			<View alignItems="center" justifyContent="center">
				<Button size="$4" variant="round" onPress={handleToggleInput}>
					{isOpen ? <X size="$2" /> : <Search opacity={isOpen ? 0 : 1} size="$1" />}
				</Button>
			</View>

			<AnimatePresence>
				{isOpen && (
					<View position="absolute" width={width - paddingRightValue * 4.5} right={paddingRightValue * 2.5}>
						<Input autoFocus size="$3" paddingVertical="$1" {...props} onChangeText={debounce(onChangeText, 300)} ref={inputRef} />
					</View>
				)}
			</AnimatePresence>
		</>
	);
};
