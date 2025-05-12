import { PropsWithChildren } from "react";
import { View, ViewProps } from "tamagui";

export const Screen = ({ children, ...props }: PropsWithChildren & ViewProps) => {
  return (
    <View padding="$4" {...props}>
      {children}
    </View>
  );
};
