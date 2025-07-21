import { supabase } from '@/api/supabase';
import { useEffect } from 'react';
import { router, SplashScreen } from 'expo-router';
import { User as SupabaseUser } from '@supabase/auth-js';
import { AuthUser, PostgrestSingleResponse } from '@supabase/supabase-js';
import { User } from '@/api/types';
import { useQueryClient } from 'react-query';
import { useSetUser } from '@/store/authentication';

export const useCheckLoginState = () => {
    const setUser = useSetUser();
    const queryClient = useQueryClient();

    const getUserFromDB = async (user: SupabaseUser) => {
        if (!user) {
            return undefined;
        }

        try {
            const result: PostgrestSingleResponse<User> = await supabase.from('users').select().eq('id', user.id).single();

            return result.data;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    };

    const handleCheckLoginstate = async (user: AuthUser | null) => {
        if (user === null) {
            await supabase.auth.signOut();
            setUser(undefined);
            router.replace('/');
            return;
        }

        setUser(user);

        const userFromDb = await getUserFromDB(user);

        if (!userFromDb) {
            router.replace('/authentication/onboarding');
            return;
        }

        void queryClient.refetchQueries();
        router.replace('/(tabs)');
    };

    return {
        handleCheckLoginstate,
    };
};

export const useCheckLoginStateOnAppStart = () => {
    const { handleCheckLoginstate } = useCheckLoginState();
    useEffect(() => {
        supabase.auth
            .getUser()
            .then(async (user) => {
                await handleCheckLoginstate(user.data.user);
            })
            .finally(() => {
                setTimeout(() => {
                    void SplashScreen.hideAsync();
                }, 500);
            });
    }, []);
};
