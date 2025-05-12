import { JSX, useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { getTokenValue, InputProps, View } from 'tamagui';
import { Input } from '@/components/tamagui';
import { IconProps } from '@tamagui/helpers-icon';

export const InputWithIcon = ({
  Icon,
  showIcon,
  ...props
}: InputProps & { Icon?: (props: IconProps) => JSX.Element; showIcon?: boolean }) => {
  const [inputHeight, setInputHeight] = useState<number>();

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const possibleHeight = e.nativeEvent.layout.height;
    if (possibleHeight) {
      setInputHeight(possibleHeight);
    }
  }, []);

  const iconTop = useMemo(
    () => (inputHeight !== undefined ? inputHeight / 2 - getTokenValue('$1.5', 'size') / 2 : 0),
    [inputHeight]
  );

  return (
    <View>
      <Input onLayout={onLayout} {...props} />
      {inputHeight && showIcon && Icon && (
        <Icon position="absolute" right="$3" size="$1.5" top={iconTop} />
      )}
    </View>
  );
};
