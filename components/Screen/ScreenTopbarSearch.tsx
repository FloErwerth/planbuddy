import { Input } from "@/components/tamagui/Input";
import { useState } from "react";
import { Pressable } from "react-native";
import { AnimatePresence, debounce, getTokenValue, InputProps, Token, View } from "tamagui";
import { Search, X } from "@tamagui/lucide-icons";
import { Button } from "@/components/tamagui/Button";
import { useWindowDimensions } from "react-native";

type SearchInputProps = Omit<InputProps, "onChangeText"> & {
	onChangeText: (text: string) => void;
	top?: number;
};
export const ScreenTopbarSearch = ({ onChangeText, top, ...props }: SearchInputProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { width } = useWindowDimensions();

	const paddingRightValue = getTokenValue("$4" as Token, "space");

	return (
		<>
			<View alignItems="center" justifyContent="center">
				<Pressable onPress={() => setIsOpen((open) => !open)}>
					<Search size="$2" />
				</Pressable>
			</View>

			{isOpen && (
				<AnimatePresence>
					<View
						animation="100ms"
						position="absolute"
						width={width - paddingRightValue * 4}
						top={top || "$-2"}
						right={paddingRightValue * 2}
						enterStyle={{ opacity: 0 }}
						exitStyle={{ opacity: 0 }}
					>
						<Input borderRadius="$12" {...props} onChangeText={debounce(onChangeText, 300)} />
						<Button variant="transparent" backgroundColor="transparent" position="absolute" right="$2" top={0} onPress={() => setIsOpen(false)}>
							<X size="$2" backgroundColor="transparent" />
						</Button>
					</View>
				</AnimatePresence>
			)}
		</>
	);
};
