import { InputProps, Theme, View } from 'tamagui';
import { Control, Controller, Path } from 'react-hook-form';
import { Text } from '@/components/tamagui';
import { CircleX, Eye, EyeOff } from '@tamagui/lucide-icons';
import { InputWithIcon } from '@/components/InputWithIcon';
import { useCallback } from 'react';

export const ValidatedInput = <FieldValues extends Record<string, string>>({
  control,
  name,
  showErrorMessage = false,
  secureTextEntry,
}: InputProps & {
  control: Control<FieldValues>;
  name: Path<FieldValues>;
  showErrorMessage?: boolean;
}) => {
  const getDisplayedIcon = useCallback(
    (hasError: boolean) => {
      if (hasError) {
        return CircleX;
      }
      if (secureTextEntry) {
        return EyeOff;
      }
      return Eye;
    },
    [secureTextEntry]
  );

  return (
    <Controller
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const theme = error ? 'error' : 'default';
        const Icon = getDisplayedIcon(!!error);
        return (
          <View>
            <Theme name={theme}>
              <InputWithIcon
                value={value}
                onChangeText={onChange}
                Icon={(props) => <Icon color="$color" {...props} />}
                showIcon={!!error}
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
