import { type FieldValues, useController } from "react-hook-form";
import { View } from "tamagui";
import type { BaseFormFieldProps } from "@/components/FormFields/types";
import { SizeableText } from "@/components/tamagui/Text";

export const FormField = <T extends FieldValues>({ children, label, name, ...props }: BaseFormFieldProps<T>) => {
	const {
		fieldState: { error },
	} = useController({ name });

	return (
		<View gap="$1.5" {...props}>
			{label && <SizeableText>{label}</SizeableText>}
			{children}
			{!!error && <SizeableText theme="error">{error.message}</SizeableText>}
		</View>
	);
};
