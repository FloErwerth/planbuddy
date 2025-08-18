import { PropsWithChildren, ReactNode } from 'react';
import { ButtonProps, GetThemeValueForKey } from 'tamagui';
import { Button } from '../tamagui/Button';

type TogglePillButtonProps = {
    icon?: ReactNode;
    active: boolean;
    inactiveBackgroundColor?: GetThemeValueForKey<'backgroundColor'>;
    activeBackgroundColor?: GetThemeValueForKey<'backgroundColor'>;
} & PropsWithChildren &
    ButtonProps;

export const ToggleButton = ({
    active,
    onPress,
    icon,
    children,
    borderRadius,
    activeBackgroundColor,
    inactiveBackgroundColor,
    ...buttonProps
}: TogglePillButtonProps) => {
    const backgroundColor = (() => {
        if (!inactiveBackgroundColor && !activeBackgroundColor) {
            return active ? '$primary' : '$accent';
        }

        if (active) {
            return activeBackgroundColor ?? '$primary';
        }

        if (!active) {
            return inactiveBackgroundColor ?? '$accent';
        }
    })();

    return (
        <Button
            size="$2"
            variant={active ? 'primary' : 'secondary'}
            backgroundColor={backgroundColor}
            borderRadius={borderRadius}
            onPress={onPress}
            {...buttonProps}
        >
            {children}
            {active && icon}
        </Button>
    );
};
