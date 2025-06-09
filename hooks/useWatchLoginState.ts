import { useEffect } from 'react';
import { supabase } from '@/api/supabase';
import { router } from 'expo-router';
import { useSetUser } from '@/store/user';
import { useSetIsEmailSent } from '@/store/login';

export const useWatchLoginState = () => {
  const setUser = useSetUser();
  const setEmailSent = useSetIsEmailSent();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);

        supabase
          .from('users')
          .select()
          .eq('id', session.user.id)
          .then(async ({ data }) => {
            setEmailSent(false);
            if (data?.length === 1 && data[0].wasOnboarded) {
              // found a user
              router.replace('/(tabs)');
            } else {
              // create an entry in the database
              router.replace('/onboarding');
            }
          });
      }

      router.replace('/login');
    });

    return () => subscription.unsubscribe();
  }, [setEmailSent, setUser]);
};
