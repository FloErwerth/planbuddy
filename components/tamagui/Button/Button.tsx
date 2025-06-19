import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
  pressStyle: {
    opacity: 0.85,
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        elevation: 4,
      },
      secondary: {
        backgroundColor: '$inputBackground',
        color: '$color',
      },
      transparent: {
        elevation: 0,
        padding: 0,
      },
    },
    disabled: {
      true: {
        backgroundColor: 'grey',
      },
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
