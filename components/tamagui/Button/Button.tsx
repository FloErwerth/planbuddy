import { Button as TamaguiButton, styled } from "tamagui";

export const Button = styled(TamaguiButton, {
  variants: {
    variant: {
      primary: {
        backgroundColor: "$primary",
        color: "white",
        elevation: 4,
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});
