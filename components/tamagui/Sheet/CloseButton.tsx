import { ButtonProps } from "tamagui";
import { Button } from "@/components/tamagui/Button";

export const CloseButton = (props: ButtonProps) => {
	return (
		<Button variant="secondary" size="$2" {...props}>
			{props.children || "Schließen"}
		</Button>
	);
};
