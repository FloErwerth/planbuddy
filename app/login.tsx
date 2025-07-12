import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/api/supabase';
import { Screen } from '@/components/Screen';
import { SizableText } from 'tamagui';
import { FormInput } from '@/components/FormFields';
import { Button } from '@/components/tamagui/Button';
import { z } from 'zod';
import { BackButton } from '@/components/BackButton';
import { useState } from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { makeRedirectUri } from 'expo-auth-session';
import { router } from 'expo-router';

export const registerSchema = z.object({
  email: z.string().email(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export default function LoginScreen() {
  const [emailSent, setEmailSent] = useState(false);
  const form = useForm({
    resolver: zodResolver(registerSchema),
  });

  async function signUpWithPhone({ email }: RegisterSchema) {
    const result = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: makeRedirectUri(),
      },
    });

    if (result.error) {
      // show information but nothing we can do really
      return;
    }

    router.push({ pathname: '/token', params: { email } });
  }

  return (
    <>
      <Screen back={<BackButton href=".." />} flex={1} gap="$8">
        <FormProvider {...form}>
          <SizableText size="$8" textAlign="center">
            Melde dich ganz bequem ohne Passwort an
          </SizableText>
          <FormInput label="Email" name="email" autoCapitalize="none" />
          <Button onPress={form.handleSubmit(signUpWithPhone)}>Weiter</Button>
        </FormProvider>
      </Screen>
      {emailSent && (
        <Animated.View
          layout={FadeIn}
          entering={FadeIn}
          exiting={FadeOut}
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          ]}
        >
          <Screen borderRadius="$4" maxWidth="90%">
            <SizableText size="$6">Email zugeschickt</SizableText>
            <SizableText>Das hat geklappt! Dir wurde eine Email an erwerthflorian@outlook.de zugeschickt.</SizableText>
            <SizableText>Bitte überprüfe nun dein Postfach, nach dem Bestätigen des Logins wirst Du zur App zurückgeleitet.</SizableText>
          </Screen>
        </Animated.View>
      )}
    </>
  );
}
