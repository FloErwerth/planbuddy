import { Input as TamaguiInput, styled } from 'tamagui';

export const Input = styled(TamaguiInput, {
  color: '$color',
  fontWeight: 400,
  focusStyle: {
    borderColor: '$primary',
    borderWidth: 2,
    backgroundColor: '$backgroundFocus',
    color: '$darkShade',
  },
  placeholderTextColor: '$placeholderColor',
});
