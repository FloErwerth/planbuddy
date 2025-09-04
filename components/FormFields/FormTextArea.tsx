import { Controller, FieldValues } from "react-hook-form";
import { BaseFormFieldProps } from "@/components/FormFields/types";
import { FormField } from "@/components/FormFields/FormField";
import { TextArea } from "@/components/tamagui/TextArea";
import { ComponentProps } from "react";

export const FormTextArea = <T extends FieldValues>({ name, label, ...textAreaProps }: BaseFormFieldProps<T> & ComponentProps<typeof TextArea>) => {
	return (
		<FormField {...textAreaProps} name={name} label={label}>
			<Controller
				render={({ field: { value, onChange }, fieldState: { error } }) => {
					const theme = error ? "error" : "default";
					return <TextArea theme={theme} value={value} onChangeText={onChange} {...textAreaProps} />;
				}}
				name={name}
			/>
		</FormField>
	);
};
