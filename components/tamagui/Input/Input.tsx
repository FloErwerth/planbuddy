import { Input as TamaguiInput, styled } from 'tamagui';

export const Input = styled(TamaguiInput, {
  color: '$color',
  fontWeight: 400,
  borderWidth: 0,
  backgroundColor: '$inputBackground',
  focusStyle: {
    borderColor: '$primary',
    borderWidth: '$1',
    backgroundColor: '$backgroundFocus',
    color: '$primary',
    fontWeight: 700,
  },
  placeholderTextColor: '$placeholderColor',
  variants: {
    disabled: {
      true: {
        borderColor: '$color.gray10Light',
        borderWidth: 1,
        color: '$color.gray10Light',
      },
    },
    variant: {
      small: {
        fontSize: '$2',
        padding: '$1.5',
        height: '$2',
      },
      medium: {},
      large: {
        fontSize: '$6',
        padding: '$3',
        height: '$5',
      },
    },
  },
  defaultVariants: {
    variant: 'medium',
  },
});
