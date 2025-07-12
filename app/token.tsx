import { router, useGlobalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { SizableText, View } from 'tamagui';
import { BackButton } from '@/components/BackButton';
import { TokenInput } from '@/components/TokenInput/TokenInput';
import { useCallback, useEffect, useState } from 'react';
import { array, string } from 'zod';
import { supabase } from '@/api/supabase';
import { useSetUser } from '@/store/user';

const tokenSchema = array(string()).refine((val) => {
  const combined = val.join('');
  const parsedInt = parseInt(combined);
  return val.length === 6 && !Number.isNaN(parsedInt);
});

export default function Token() {
  const { email } = useGlobalSearchParams<{ email: string }>();
  const [token, setToken] = useState<string[]>([]);
  const [authenticationActive, setAuthenticationActive] = useState(false);
  const setUser = useSetUser();

  const onComplete = useCallback(async () => {
    if (!email || authenticationActive) {
      return;
    }

    setAuthenticationActive(true);
    const { data, error } = await supabase.auth.verifyOtp({ email: email, token: token.join(''), type: 'email' });

    if (error || !data.session || !data.user) {
      return;
    }
    setUser(data.user);
    await supabase.auth.setSession(data.session);
    router.replace('/(tabs)');
  }, [authenticationActive, email, setUser, token]);

  useEffect(() => {
    const parsedToken = tokenSchema.safeParse(token);

    if (parsedToken.success && !authenticationActive) {
      void onComplete();
    }
  }, [token, onComplete, authenticationActive]);

  return (
    <Screen back={<BackButton />} flex={1} title="Verifizierung">
      <View flex={1} justifyContent="center" gap="$6">
        <SizableText size="$6" textAlign="center">
          Bitte gebe den Code ein, welcher Dir zugeschickt wurde
        </SizableText>
        <TokenInput disabled={authenticationActive} value={token} onChange={setToken} />
      </View>
    </Screen>
  );
}
