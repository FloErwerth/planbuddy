import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '@/components/Screen';
import { SizableText, View } from 'tamagui';
import { FormInput } from '@/components/FormFields';
import { Button } from '@/components/tamagui/Button';
import { z } from 'zod';
import { BackButton } from '@/components/BackButton';
import { router, useNavigation } from 'expo-router';
import { useLoginContext } from '@/providers/LoginProvider';
import { Separator } from '@/components/tamagui/Separator';
import { useCallback, useEffect, useState } from 'react';
import { Sheet } from '@/components/tamagui/Sheet';

export const registerSchema = z.object({
  email: z.string().email(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export default function LoginScreen() {
  const navigation = useNavigation();
  const [hintSheetOpen, setHintSheetOpen] = useState(false);
  const { email: previousEmail, setEmail, setStartedLoginAttempt, startResendTokenTimer, resendTokenTime } = useLoginContext();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: previousEmail },
  });

  const resetForm = useCallback(() => {
    form.reset({ email: previousEmail });
  }, [form, previousEmail]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', resetForm);
    return () => {
      unsubscribe();
    };
  }, [navigation, resetForm]);

  const signUpWithPhone = useCallback(
    ({ email }: RegisterSchema) => {
      if (email === previousEmail && resendTokenTime > 0) {
        setHintSheetOpen(true);
        return;
      }

      router.push({ pathname: '/sendingEmail', params: { email } });
      setEmail(email);
      startResendTokenTimer();
    },
    [previousEmail, resendTokenTime, setEmail, startResendTokenTimer]
  );

  const handleEnterCode = useCallback(() => {
    setHintSheetOpen(false);
    setStartedLoginAttempt(true);
    router.push('/token');
  }, [setStartedLoginAttempt]);

  return (
    <>
      <Screen back={<BackButton href=".." />} flex={1}>
        <FormProvider {...form}>
          <SizableText size="$8" textAlign="center">
            Melde dich ganz bequem ohne Passwort an
          </SizableText>
          <FormInput label="Email" name="email" autoCapitalize="none" />
          <Button onPress={form.handleSubmit(signUpWithPhone)}>Anmelden</Button>
        </FormProvider>
      </Screen>
      <Sheet snapPoints={undefined} snapPointsMode="fit" open={hintSheetOpen} onOpenChange={setHintSheetOpen}>
        <Screen>
          <SizableText size="$6">Gleiche E-Mail</SizableText>
          <SizableText>Es sieht so aus als hättest Du die gleiche E-Mail wie in deinem vorherigen Login-Versuch benutzt.</SizableText>
          <View gap="$2">
            <SizableText>Du kannst Dir erneut einen Code an {previousEmail} verschicken</SizableText>
            <Button disabled={resendTokenTime > 0}>{resendTokenTime > 0 ? `Code in ${resendTokenTime} erneut versenden` : `Code erneut versenden`}</Button>
          </View>
          <Separator />
          <View gap="$2">
            <SizableText>Oder, wenn Du doch einen Code erhalten hast:</SizableText>
            <Button onPress={handleEnterCode}>Deinen Code eingeben</Button>
          </View>
        </Screen>
      </Sheet>
    </>
  );
}
