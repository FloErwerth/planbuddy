import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
    pressStyle: {
        opacity: 0.85,
    },
    variants: {
        variant: {
            primary: {
                backgroundColor: '$primary',
                color: '$accent',
                elevation: '$1',
            },
            secondary: {
                backgroundColor: '$accent',
                color: '$primary',
            },
            transparent: {
                elevation: 0,
                padding: 0,
            },
            round: {
                backgroundColor: '$accent',
                borderRadius: '$12',
                width: '$3',
                height: '$3',
                padding: 0,
            },
        },
        disabled: {
            true: {
                backgroundColor: '$color.gray6Light',
                borderColor: '$color.gray8Light',
                borderWidth: 1,
                color: '$color.gray9Light',
                elevation: 0,
            },
        },
    },
    defaultVariants: {
        variant: 'primary',
    },
});
