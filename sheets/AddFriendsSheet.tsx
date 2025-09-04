import { SheetProps } from "tamagui";
import { AddFriendsScreen } from "@/screens/AddFriendsScreen";
import { Sheet } from "@/components/tamagui/Sheet";

export const AddFriendsSheet = (props: SheetProps) => {
	return (
		<Sheet {...props}>
			<AddFriendsScreen />
		</Sheet>
	);
};
