import { Controller, FieldValues } from 'react-hook-form';
import { BaseFormFieldProps } from '@/components/FormFields/types';
import { FormField } from '@/components/FormFields/FormField';
import { InputWithIcon } from '@/components/Inputs/InputWithIcon';
import { useState } from 'react';
import { Eye, EyeClosed } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';
import { InputProps } from 'tamagui';

export const FormPasswordInput = <T extends FieldValues>({ name, label, ...inputProps }: BaseFormFieldProps<T> & InputProps) => {
  const [showText, setShowText] = useState(false);

  const Icon = showText ? <Eye size="$1" /> : <EyeClosed size="$1" />;

  const toggleShowText = () => {
    setShowText((showText) => !showText);
  };

  return (
    <FormField name={name} label={label}>
      <Controller
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const theme = error ? 'error' : 'default';
          return (
            <InputWithIcon
              theme={theme}
              value={value}
              secureTextEntry={!showText}
              onChangeText={onChange}
              Icon={<Pressable onPress={toggleShowText}>{Icon}</Pressable>}
              {...inputProps}
            />
          );
        }}
        name={name}
      />
    </FormField>
  );
};
