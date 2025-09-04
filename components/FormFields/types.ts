import { FieldValues, Path } from "react-hook-form";
import { ViewProps } from "tamagui";

export type BaseFormFieldProps<T extends FieldValues> = {
	label?: string;
	name: Path<T>;
	help?: { title: string; description: string };
} & ViewProps;
