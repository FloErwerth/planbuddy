import { InputProps, Theme, View } from 'tamagui';
import { Control, Controller, Path } from 'react-hook-form';
import {Input, Text} from '@/components/tamagui';
import { CircleX, Eye, EyeOff } from '@tamagui/lucide-icons';
import { InputWithIcon } from '@/components/InputWithIcon';
import { useCallback } from 'react';

export const ValidatedInput = <FieldValues extends Record<string, string>>({
  control,
  name,
  showErrorMessage = false,
    ...inputProps
}: InputProps & {
  control: Control<FieldValues>;
  name: Path<FieldValues>;
  showErrorMessage?: boolean;
}) => {

  return (
    <Controller
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const theme = error ? 'error' : 'default';
        return (
          <View>
            <Theme name={theme}>
              <Input
                value={value}
                onChangeText={onChange}
                  {...inputProps}
              />
              {!!error && showErrorMessage && <Text>{error.message}</Text>}
            </Theme>
          </View>
        );
      }}
      name={name}
    />
  );
};
