import { ButtonProps } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { Button } from "@/components/tamagui/Button";

export const PlusButton = (props: ButtonProps) => {
	return (
		<Button variant="round" {...props}>
			<Plus size="$1" />
		</Button>
	);
};
