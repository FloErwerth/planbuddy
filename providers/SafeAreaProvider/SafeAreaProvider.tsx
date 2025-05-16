import { PropsWithChildren } from "react";
import { SafeAreaProvider as _SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const safeAreaViewStyles = { flex: 1 };

export const SafeAreaProvider = ({ children }: PropsWithChildren) => {
  return (
    <_SafeAreaProvider>
      <SafeAreaView style={safeAreaViewStyles}>{children}</SafeAreaView>
    </_SafeAreaProvider>
  );
};
