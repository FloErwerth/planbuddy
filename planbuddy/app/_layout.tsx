import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Providers } from "@/providers";

SplashScreen.preventAutoHideAsync();

const defaultOptions = { headerShown: false };

export default function () {
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      setTimeout(SplashScreen.hideAsync, 1000);
    }
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Providers>
      <Stack>
        <Stack.Screen name="index" options={defaultOptions} />
      </Stack>
    </Providers>
  );
}
