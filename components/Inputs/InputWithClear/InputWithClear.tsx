import { InputWithIcon, InputWithIconProps } from '@/components/Inputs/InputWithIcon';
import { useState } from 'react';
import { X } from '@tamagui/lucide-icons';
import { Pressable } from 'react-native';

export const InputWithClear = (inputProps: InputWithIconProps) => {
  const [showClear, setShowClear] = useState(false);

  const Icon = showClear ? <X size="$1" /> : null;

  const clearText = () => {
    if (!showClear) {
      return;
    }
    setShowClear(false);
    inputProps.onChangeText?.('');
  };

  const handleTextInput = (value: string) => {
    setShowClear(!!value);
    inputProps.onChangeText?.(value);
  };

  return (
    <InputWithIcon
      {...inputProps}
      Icon={<Pressable onPress={clearText}>{Icon}</Pressable>}
      onChangeText={handleTextInput}
    />
  );
};
