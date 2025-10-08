import type { FieldValues, Path } from "react-hook-form";
import type { ViewProps } from "tamagui";

export type BaseFormFieldProps<T extends FieldValues> = {
	label?: string;
	name: Path<T>;
	help?: { title: string; description: string };
} & ViewProps;
