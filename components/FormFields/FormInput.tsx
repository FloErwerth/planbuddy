import { Controller, type FieldValues } from "react-hook-form";
import type { BaseFormFieldProps } from "@/components/FormFields/types";
import { FormField } from "@/components/FormFields/FormField";
import { Input } from "@/components/tamagui/Input";
import type { InputProps } from "tamagui";

export const FormInput = <T extends FieldValues>({ name, label, ...inputProps }: BaseFormFieldProps<T> & InputProps) => {
	return (
		<FormField {...inputProps} name={name} label={label}>
			<Controller
				render={({ field: { value, onChange }, fieldState: { error } }) => {
					const theme = error ? "error" : "default";
					return <Input borderColor={error ? "$error" : "transparent"} theme={theme} value={value} onChangeText={onChange} {...inputProps} />;
				}}
				name={name}
			/>
		</FormField>
	);
};
