import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import { router } from "expo-router";
import { useResetUser } from "@/store/authentication";
import { useQueryClient } from "@tanstack/react-query";
import { useLoginContext } from "@/providers/LoginProvider";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: Platform.OS !== "web",
    detectSessionInUrl: false,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    void supabase.auth.startAutoRefresh();
  } else {
    void supabase.auth.stopAutoRefresh();
  }
});

export const useLogout = () => {
  const resetUser = useResetUser();
  const queryClient = useQueryClient();
  const { resetTokenPage, setEmail } = useLoginContext();
  return async () => {
    const result = await supabase.auth.signOut();

    if (result.error) {
      // login failed
      return;
    }

    resetTokenPage();
    resetUser();
    setEmail("");
    router.replace("/");
    await queryClient.invalidateQueries();
  };
};
