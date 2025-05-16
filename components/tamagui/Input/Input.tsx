import { Input as TamaguiInput, styled } from 'tamagui';

export const Input = styled(TamaguiInput, {
  color: '$color',
  borderRadius: '$4',
  fontWeight: 500,
  focusStyle: {
    borderColor: '$primary',
    backgroundColor: '$backgroundFocus',
    color: '$darkShade',
  },
  placeholderTextColor: '$gray10Light',
});
