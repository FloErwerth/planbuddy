import {
  Checkbox as TamaguiCheckbox,
  CheckboxProps as TamaguiCheckboxProps,
  XStack,
} from 'tamagui';
import { Check } from '@tamagui/lucide-icons';

type CheckboxProps = TamaguiCheckboxProps & {
  checked: boolean;
};

export const Checkbox = ({ checked, children, ...props }: CheckboxProps) => {
  const CheckIcon = () => {
    if (checked) {
      return <Check />;
    }
    return undefined;
  };

  return (
    <XStack alignItems="center" gap="$4">
      <TamaguiCheckbox {...props}>
        <TamaguiCheckbox.Indicator>
          <CheckIcon />
        </TamaguiCheckbox.Indicator>
      </TamaguiCheckbox>
      {children}
    </XStack>
  );
};
