import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { SizableText, View } from 'tamagui';
import { BackButton } from '@/components/BackButton';
import { TokenInput } from '@/components/TokenInput/TokenInput';
import { useCallback, useEffect, useState } from 'react';
import { array, string } from 'zod';
import { supabase } from '@/api/supabase';
import { useSetUser } from '@/store/user';
import { Sheet } from '@/components/tamagui/Sheet';
import { Button } from '@/components/tamagui/Button';
import { useLoginContext } from '@/providers/LoginProvider';

const tokenSchema = array(string()).refine((val) => {
  const combined = val.join('');
  const parsedInt = parseInt(combined);
  return val.length === 6 && !Number.isNaN(parsedInt);
});

export default function Token() {
  const {
    setEmail,
    email = 'erwerthflorian@outlook.de',
    resendTokenTime,
    startedLoginAttempt,
    setStartedLoginAttempt,
    startResendTokenTimer,
    resetTokenPage,
  } = useLoginContext();
  const [token, setToken] = useState<string[]>([]);
  const [authenticationActive, setAuthenticationActive] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const setUser = useSetUser();

  console.log(startedLoginAttempt, resendTokenTime);

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

  const resendToken = async () => {
    router.push({ pathname: '/sendingEmail', params: { email } });

    const result = await supabase.auth.signInWithOtp({
      email,
    });
    startResendTokenTimer();

    if (result.error) {
      router.replace('/login');

      // set errors in form
      return;
    }
  };

  const handleChangeMail = useCallback(() => {
    setStartedLoginAttempt(false);
    setShowSheet(false);
    router.push('/login');
  }, [setStartedLoginAttempt]);

  useEffect(() => {
    const parsedToken = tokenSchema.safeParse(token);

    if (parsedToken.success && !authenticationActive) {
      void onComplete();
    }
  }, [token, onComplete, authenticationActive]);

  return (
    <>
      <Screen back={<BackButton href="/login" />} flex={1} title="Verifizierung">
        <View flex={1} justifyContent="center" gap="$6">
          <SizableText size="$8">Checke deine E-Mails</SizableText>
          <SizableText>
            Wir haben dir eine E-Mail an <SizableText fontWeight="bold">{email}</SizableText> gesendet. Bitte gib den dort angezeigten Code unten ein
          </SizableText>
          <TokenInput disabled={authenticationActive} value={token} onChange={setToken} />
          <Button onPress={() => setShowSheet(true)} size="$3" alignSelf="flex-start" variant="secondary">
            Keinen Code erhalten
          </Button>
        </View>
      </Screen>
      <Sheet snapPoints={undefined} snapPointsMode="fit" open={showSheet} onOpenChange={setShowSheet}>
        <Screen>
          <SizableText size="$6">Hast Du keinen Code erhalten?</SizableText>
          <SizableText>Wenn Du keinen Code erhalten hast, dann hast Du folgende Möglichkeiten:</SizableText>
          <View gap="$2">
            <Button onPress={resendToken} disabled={resendTokenTime > 0 && startedLoginAttempt}>
              {startedLoginAttempt && resendTokenTime > 0 ? `In ${resendTokenTime} erneut senden` : 'Erneut senden'}
            </Button>
            <Button onPress={handleChangeMail}>E-Mail-Addresse ändern</Button>
          </View>
        </Screen>
      </Sheet>
    </>
  );
}
