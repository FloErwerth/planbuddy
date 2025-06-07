import { FieldValues, Path } from 'react-hook-form';
import { PropsWithChildren } from 'react';

export type BaseFormFieldProps<T extends FieldValues> = {
  label?: string;
  name: Path<T>;
  help?: { title: string; description: string };
} & PropsWithChildren;
