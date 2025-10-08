import type { PropsWithChildren } from "react";
import { SafeAreaProvider as _SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

export const SafeAreaProvider = ({ children }: PropsWithChildren) => {
	return <_SafeAreaProvider initialMetrics={initialWindowMetrics}>{children}</_SafeAreaProvider>;
};
