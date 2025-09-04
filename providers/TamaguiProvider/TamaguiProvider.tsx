import { PropsWithChildren } from "react";
import { TamaguiProvider as TamaProvider } from "tamagui";
import { tamaguiConfig } from "@/providers/TamaguiProvider/tamaguiConfig";

export const TamaguiProvider = ({ children }: PropsWithChildren) => {
	return <TamaProvider config={tamaguiConfig}>{children}</TamaProvider>;
};
