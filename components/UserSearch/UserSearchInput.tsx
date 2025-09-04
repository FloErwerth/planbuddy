import { Input } from "@/components/tamagui/Input";
import { useUserSearchContext } from "@/components/UserSearch/UserSearchContext";

export const UserSearchInput = () => {
	const { search, searchDisplay, setSearchDisplay } = useUserSearchContext();

	const handleSearch = (text: string) => {
		search(text);
		setSearchDisplay(text);
	};

	return <Input value={searchDisplay} placeholder="Name oder E-Mail" onChangeText={handleSearch} />;
};
