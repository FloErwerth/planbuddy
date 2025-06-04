import { Button, Text } from '@/components/tamagui';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from 'tamagui';
import { PartyPopper } from '@tamagui/lucide-icons';
import { loginSchema, LoginSchema } from '@/screens/Authentication/schemas';
import { FormInput } from '@/components/FormFields/FormInput';
import { useEffect, useState } from 'react';
import { Screen } from '@/components/Screen';
import { supabase } from '@/api/supabase';
import { makeRedirectUri } from 'expo-auth-session';
import { EmailSentSheet } from '@/screens/Login/EmailSentSheet';
import * as QueryParams from 'expo-auth-session/build/QueryParams';
import { useURL } from 'expo-linking';
import { useEmailSentAtom } from '@/store/login';

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
  if (error) throw error;
};

const useLoginSession = () => {
  const url = useURL();

  useEffect(() => {
    void createSessionFromUrl(url);
  }, [url]);
};
const redirectTo = makeRedirectUri();

export default function LoginScreen() {
  useLoginSession();
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useEmailSentAtom();

  async function signInWithEmail({ email }: LoginSchema) {
    setIsLoading(true);
    setIsEmailSent(true);
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    setIsLoading(false);
  }

  return (
    <FormProvider {...form}>
      <Screen justifyContent="center" alignItems="center" flex={1}>
        <Card gap="$4" minWidth="90%" padding="$4" elevation="$2">
          <PartyPopper marginHorizontal="auto" size="$8" color="$primary" />
          <Text size="$8" textAlign="center">
            Willkommen zurück bei PlanBuddy
          </Text>
          <Text size="$4" textAlign="center">
            Gib deine E-Mail, um Dir einen Login-Link zuzuschicken.
          </Text>
          <FormInput name="email" placeholder="Deine E-Mail Addresse" />
          <Button onPress={form.handleSubmit(signInWithEmail)}>Einloggen</Button>
        </Card>
      </Screen>
      <EmailSentSheet isOpen={isEmailSent} onOpenChange={setIsEmailSent} />
    </FormProvider>
  );
}
