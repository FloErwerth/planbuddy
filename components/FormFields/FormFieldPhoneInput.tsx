import { Controller, FieldValues } from 'react-hook-form';
import { BaseFormFieldProps } from '@/components/FormFields/types';
import { FormField } from '@/components/FormFields/FormField';
import { Input } from '@/components/tamagui/Input';
import { InputProps, XStack } from 'tamagui';

export const FormFieldPhoneInput = <T extends FieldValues>({ name, label, ...inputProps }: BaseFormFieldProps<T> & InputProps) => {
  return (
    <FormField {...inputProps} name={name} label={label}>
      <Controller
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const theme = error ? 'error' : 'default';
          return (
            <XStack gap="$2">
              <Input value="+49" disabled color="$color.gray11Light" borderWidth={0} />
              <Input autoComplete="tel" textContentType="telephoneNumber" theme={theme} flex={1} value={value} onChangeText={onChange} {...inputProps} />
            </XStack>
          );
        }}
        name={name}
      />
    </FormField>
  );
};
