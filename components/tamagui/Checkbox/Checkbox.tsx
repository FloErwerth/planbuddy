import {
  Checkbox as TamaguiCheckbox,
  CheckboxProps as TamaguiCheckboxProps,
  XStack,
} from 'tamagui';
import { Check } from '@tamagui/lucide-icons';

type CheckboxProps = TamaguiCheckboxProps & {
  checked: boolean;
  onChecked?: (checked: boolean) => void;
};

export const Checkbox = ({ checked, children, ...props }: CheckboxProps) => {
  const handlePress = () => {
    if (props.onChecked) {
      props.onChecked(checked);
    }
  };

  const CheckIcon = () => {
    if (checked) {
      return <Check onPress={handlePress} scale={0.6} />;
    }
    return undefined;
  };

  return (
    <XStack alignItems="center" gap={props.gap ?? '$4'}>
      <TamaguiCheckbox {...props} onPress={handlePress}>
        <TamaguiCheckbox.Indicator>
          <CheckIcon />
        </TamaguiCheckbox.Indicator>
      </TamaguiCheckbox>
      {children}
    </XStack>
  );
};
