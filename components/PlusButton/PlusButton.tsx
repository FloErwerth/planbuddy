import { Plus } from "@tamagui/lucide-icons";
import type { ButtonProps } from "tamagui";
import { Button } from "@/components/tamagui/Button";

export const PlusButton = (props: ButtonProps) => {
	return (
		<Button variant="round" {...props}>
			<Plus size="$1" />
		</Button>
	);
};
