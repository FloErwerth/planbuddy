import { PropsWithChildren } from "react";
import { TamaguiProvider as TamaProvider } from "tamagui";

export const TamaguiProvider = ({ children }: PropsWithChildren) => {
  return <TamaProvider>{children}</TamaProvider>;
};
