import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { Input, XStack } from 'tamagui';

type OTPInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  length?: number;
  disabled?: boolean;
  onResendOTP?: () => void;
};

export const TokenInput = ({ value, onChange, length = 6, disabled = false }: OTPInputProps) => {
  const inputRefs = useRef<Input[]>([]);
  const animatedValues = useRef<Animated.Value[]>([]);

  // Initialize animation values
  useEffect(() => {
    animatedValues.current = Array(length)
      .fill(0)
      .map(() => new Animated.Value(0));
  }, [length]);

  const focusInput = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].focus();

      // Trigger animation
      Animated.sequence([
        Animated.timing(animatedValues.current[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues.current[index], {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleChange = useCallback(
    (text: string, index: number) => {
      const newValue = [...value];
      newValue[index] = text;
      onChange(newValue);

      if (text && index < length - 1) {
        focusInput(index + 1);
      }
    },
    [length, onChange, value]
  );

  const handleKeyPress = useCallback(
    (event: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
      if (event.nativeEvent.key === 'Backspace' && index > 0) {
        handleChange('', index);
        focusInput(index - 1);
      }
    },
    [handleChange]
  );

  const mappedInputs = useMemo(
    () =>
      Array(length)
        .fill(0)
        .map((_, index) => {
          return (
            <Input
              key={index}
              ref={(ref) => {
                if (!ref) {
                  return;
                }
                inputRefs.current[index] = ref;
              }}
              autoFocus={index === 0}
              onPress={() => inputRefs.current[index].setSelection(0, 1)}
              onFocus={() => inputRefs.current[index].setSelection(0, 1)}
              textAlign="center"
              maxLength={1}
              size="$4"
              fontSize="$6"
              fontWeight="bold"
              keyboardType="number-pad"
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              value={value[index]}
              editable={!disabled}
              selectTextOnFocus
            />
          );
        }),
    [disabled, handleChange, handleKeyPress, length, value]
  );

  return <XStack justifyContent="space-between">{mappedInputs}</XStack>;
};
