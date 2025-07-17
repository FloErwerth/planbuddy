import { AnimatePresence, Checkbox as TamaguiCheckbox, CheckboxProps as TamaguiCheckboxProps, XStack } from 'tamagui';
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
            <TamaguiCheckbox {...props} overflow="visible">
                <AnimatePresence>
                    {checked && (
                        <TamaguiCheckbox.Indicator
                            borderRadius="$2"
                            animation="100ms"
                            width="$1"
                            height="$1"
                            alignItems="center"
                            justifyContent="center"
                            enterStyle={{ scale: 0.5, opacity: 0 }}
                            exitStyle={{ scale: 0.5, opacity: 0 }}
                            forceMount
                            backgroundColor="$primary"
                        >
                            <CheckIcon />
                        </TamaguiCheckbox.Indicator>
                    )}
                </AnimatePresence>
            </TamaguiCheckbox>
            {children}
        </XStack>
    );
};
