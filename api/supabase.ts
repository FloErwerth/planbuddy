import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { router } from 'expo-router';
import { useSetUser } from '@/store/authentication';
import { useQueryClient } from 'react-query';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_API_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        void supabase.auth.startAutoRefresh();
    } else {
        void supabase.auth.stopAutoRefresh();
    }
});

export const useLogout = () => {
    const setUser = useSetUser();
    const queryClient = useQueryClient();

    return async () => {
        const result = await supabase.auth.signOut();

        if (result.error) {
            // login failed
            return;
        }

        router.replace('/');
        setUser(undefined);
        await queryClient.invalidateQueries();
    };
};
