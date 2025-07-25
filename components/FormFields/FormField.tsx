import { BaseFormFieldProps } from '@/components/FormFields/types';
import { SizeableText } from '@/components/tamagui/SizeableText';
import { FieldValues, useController } from 'react-hook-form';
import { SizableText, View } from 'tamagui';

export const FormField = <T extends FieldValues>({ children, label, name, ...props }: BaseFormFieldProps<T>) => {
    const {
        fieldState: { error },
    } = useController({ name });

    return (
        <View gap="$1.5" {...props}>
            {label && <SizableText>{label}</SizableText>}
            {children}
            {!!error && <SizeableText theme="error">{error.message}</SizeableText>}
        </View>
    );
};
