import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { supabase } from '@/api/supabase';
import { useURL } from 'expo-linking';
import { useSetUser } from '@/store/user';
import { useCallback, useEffect } from 'react';
import { router, SplashScreen } from 'expo-router';
import { User as SupabaseUser } from '@supabase/auth-js';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { User } from '@/api/types';
import { useQueryClient } from 'react-query';

const createSessionFromUrl = async (url: string | null) => {
  if (url === null) {
    return;
  }
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;
  if (!access_token) return;
  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) {
    // nothing we can do
  }

  return await supabase.auth.getUser();
};

export const useLoginSession = () => {
  const url = useURL();
  const setUser = useSetUser();
  const queryClient = useQueryClient();

  const getUserFromDB = useCallback(async (user: SupabaseUser | null | undefined) => {
    if (!user) {
      return undefined;
    }

    try {
      const result: PostgrestSingleResponse<User> = await supabase
        .from('users')
        .select()
        .eq('id', user.id)
        .single();

      return result.data;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }, []);

  const handleCheckLoginstate = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const userFromDb = await getUserFromDB(user);

    setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 500);

    if (user) {
      setUser(user!);
      if (!userFromDb) {
        router.replace('/onboarding');
        return;
      }

      void queryClient.refetchQueries();
      router.replace('/(tabs)');
    }
  }, [getUserFromDB, setUser]);

  // upon app start
  useEffect(() => {
    void handleCheckLoginstate();
  }, []);

  // after login
  useEffect(() => {
    if (url === null) {
      return;
    }
    createSessionFromUrl(url).then(async (user) => {
      const userInDB = await getUserFromDB(user?.data.user);

      if (userInDB) {
        router.replace('/(tabs)');
        return;
      }

      router.replace('/onboarding');
    });
  }, [url]);
};
