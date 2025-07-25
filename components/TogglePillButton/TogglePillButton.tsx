import { PropsWithChildren, ReactNode } from 'react';
import { ButtonProps } from 'tamagui';
import { Button } from '../tamagui/Button';

type TogglePillButtonProps = {
    icon?: ReactNode;
    active: boolean;
} & PropsWithChildren &
    ButtonProps;

export const TogglePillButton = ({ active, onPress, icon, children, ...buttonProps }: TogglePillButtonProps) => {
    return (
        <Button size="$2" variant={active ? 'primary' : 'secondary'} borderRadius="$12" onPress={onPress} {...buttonProps}>
            {children}
            {active && icon}
        </Button>
    );
};
