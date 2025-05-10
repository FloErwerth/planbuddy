import { PropsWithChildren } from "react";
import { TamaguiProvider } from "@/providers/TamaguiProvider";

export const Providers = ({ children }: PropsWithChildren) => {
  return <TamaguiProvider>{children}</TamaguiProvider>;
};
