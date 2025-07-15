import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { supabase } from '@/api/supabase';
import { useSetUser } from '@/store/user';
import { useCallback, useEffect, useMemo } from 'react';
import { router, SplashScreen } from 'expo-router';
import { User as SupabaseUser } from '@supabase/auth-js';
import { AuthUser, PostgrestSingleResponse } from '@supabase/supabase-js';
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

export const useCheckLoginState = () => {
  const setUser = useSetUser();
  const queryClient = useQueryClient();

  const getUserFromDB = useCallback(async (user: SupabaseUser) => {
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
  }, []);

  const handleCheckLoginstate = useCallback(
    async (user: AuthUser | null) => {
      if (user === null) {
        await supabase.auth.signOut();
        setUser(undefined);
        router.replace('/');
        return;
      }

      setUser(user);

      const userFromDb = await getUserFromDB(user);

      if (!userFromDb) {
        router.replace('/onboarding');
        return;
      }

      void queryClient.refetchQueries();
      router.replace('/(tabs)');
    },
    [getUserFromDB, queryClient, setUser]
  );

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
  }, [handleCheckLoginstate]);

  return useMemo(
    () => ({
      handleCheckLoginstate,
    }),
    [handleCheckLoginstate]
  );
};
