import { Button as TamaguiButton, styled } from 'tamagui';

export const Button = styled(TamaguiButton, {
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: 'white',
        elevation: 4,
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
