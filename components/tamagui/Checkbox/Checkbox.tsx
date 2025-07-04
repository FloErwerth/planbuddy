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
      return <Check scale={0.6} color="$background" />;
    }
    return null;
  };

  return (
    <XStack pointerEvents="none" alignItems="center" gap={props.gap ?? '$4'}>
      <TamaguiCheckbox {...props} overflow="hidden">
        <TamaguiCheckbox.Indicator
          forceMount={checked}
          backgroundColor={checked ? '$primary' : '$background'}
        >
          <CheckIcon />
        </TamaguiCheckbox.Indicator>
      </TamaguiCheckbox>
      {children}
    </XStack>
  );
};
