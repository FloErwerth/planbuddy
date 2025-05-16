import { Button, Text } from '@/components/tamagui';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Separator } from 'tamagui';
import { PartyPopper } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import { useLoginUserMutation } from '@/api/query/user';
import { ActivityIndicator } from 'react-native';
import { loginSchema, LoginSchema } from '@/screens/Authentication/schemas';
import { FormInput } from '@/components/FormFields/FormInput';
import { useAuthenticationErrorText } from '@/screens/Authentication/useAuthenticationErrorText';
import { useCallback } from 'react';
import { PasswordInput } from '@/components/Inputs/PasswordInput';
import { Screen } from '@/components/Screen';

export default function LoginScreen() {
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { mutateAsync, isLoading } = useLoginUserMutation();
  const handleInvalidAuth = useAuthenticationErrorText();

  const login = useCallback(
    async (data: LoginSchema) => {
      const result = await mutateAsync({ ...data });
      if (result) {
        const text = handleInvalidAuth(result);
        if (text) {
          form.setError(text.field, { message: text.message });
        }
        return;
      }
      form.reset();
    },
    [form, handleInvalidAuth, mutateAsync]
  );

  return (
    <FormProvider {...form}>
      <Screen justifyContent="center" alignItems="center" flex={1}>
        <Card gap="$4" minWidth="90%" padding="$4" elevation="$2">
          <PartyPopper marginHorizontal="auto" size="$8" color="$primary" />
          <Text size="$8" textAlign="center">
            Willkommen zurück bei PlanBuddy
          </Text>
          <Text size="$4" textAlign="center">
            Gib deine E-Mail und dein Passwort ein, um dich einzuloggen
          </Text>
          <FormInput name="email" placeholder="Deine E-Mail Addresse" />
          <PasswordInput name="password" placeholder="Dein Passwort" />
          <Button onPress={form.handleSubmit(login)} iconAfter={isLoading && <ActivityIndicator />}>
            Einloggen
          </Button>
          <Separator borderWidth={0} borderBottomWidth={1} borderColor="$color.gray8Light" />
          <Text textAlign="center">
            Du hast keinen Account?{' '}
            <Link href="/register" replace>
              <Text color="$primary">Hier kannst Du dich registrieren</Text>
            </Link>
          </Text>
        </Card>
      </Screen>
    </FormProvider>
  );
}
