import { InputProps } from 'tamagui';
import { FieldValues, Path } from 'react-hook-form';

export type BaseFormFieldProps<T extends FieldValues> = InputProps & {
  label?: string;
  name: Path<T>;
  help?: { title: string; description: string };
};
