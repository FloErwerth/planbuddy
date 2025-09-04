import { Input } from "@/components/tamagui/Input";
import { debounce, InputProps } from "tamagui";

type SearchInputProps = Omit<InputProps, "onChangeText"> & {
	onChangeText: (text: string) => void;
};
export const SearchInput = ({ onChangeText, ...props }: SearchInputProps) => {
	return <Input {...props} onChangeText={debounce(onChangeText, 300)} />;
};
