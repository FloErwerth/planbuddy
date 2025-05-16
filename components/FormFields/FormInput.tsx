import { Controller, FieldValues } from 'react-hook-form';
import { BaseFormFieldProps } from '@/components/FormFields/types';
import { FormField } from '@/components/FormFields/FormField';
import { Input } from '@/components/tamagui';

export const FormInput = <T extends FieldValues>({
  name,
  label,
  ...inputProps
}: BaseFormFieldProps<T>) => {
  return (
    <FormField name={name} label={label}>
      <Controller
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const theme = error ? 'error' : 'default';
          return <Input theme={theme} value={value} onChangeText={onChange} {...inputProps} />;
        }}
        name={name}
      />
    </FormField>
  );
};
