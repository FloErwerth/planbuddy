import { SizableText, View } from 'tamagui';
import { Text } from '@/components/tamagui/Text';
import { FieldValues, useController } from 'react-hook-form';
import { BaseFormFieldProps } from '@/components/FormFields/types';

export const FormField = <T extends FieldValues>({ children, label, name, ...props }: BaseFormFieldProps<T>) => {
  const {
    fieldState: { error },
  } = useController({ name });

  return (
    <View gap="$1.5" {...props}>
      {label && <SizableText>{label}</SizableText>}
      {children}
      {!!error && <Text theme="error">{error.message}</Text>}
    </View>
  );
};
