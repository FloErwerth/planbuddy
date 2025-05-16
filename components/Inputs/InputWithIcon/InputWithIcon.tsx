import { JSX, useCallback, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { InputProps, View } from 'tamagui';
import { Input } from '@/components/tamagui';

export const InputWithIcon = ({
  Icon,
  showIcon = true,
  ...props
}: InputProps & { Icon?: JSX.Element; showIcon?: boolean }) => {
  const [inputHeight, setInputHeight] = useState<number>();

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const possibleHeight = e.nativeEvent.layout.height;
    if (possibleHeight) {
      setInputHeight(possibleHeight);
    }
  }, []);

  return (
    <View>
      <Input onLayout={onLayout} {...props} />
      {inputHeight && showIcon && Icon && (
        <View
          position="absolute"
          alignItems="center"
          justifyContent="center"
          right="$3"
          height={inputHeight}
        >
          {Icon}
        </View>
      )}
    </View>
  );
};
