import { Card, Separator } from 'tamagui';
import { PartyPopper } from '@tamagui/lucide-icons';
import { Button, Text } from '@/components/tamagui';
import { ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterSchema } from '@/screens/Authentication/schemas';
import { useRegisterUserMutation } from '@/api/query/user';
import { useCallback } from 'react';
import { FormInput } from '@/components/FormFields/FormInput';
import { useAuthenticationErrorText } from '@/screens/Authentication/useAuthenticationErrorText';
import { PasswordInput } from '@/components/Inputs/PasswordInput';
import { Screen } from '@/components/Screen';

export const Register = () => {
  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });
  const { mutateAsync, isLoading } = useRegisterUserMutation();
  const getAuthenticationErrorText = useAuthenticationErrorText();

  const register = useCallback(
    async (data: RegisterSchema) => {
      const result = await mutateAsync({ email: data.email, password: data.password });
      if (result) {
        const data = getAuthenticationErrorText(result);
        if (data) {
          form.setError(data.field, { message: data?.message });
        }
      }
    },
    [form, getAuthenticationErrorText, mutateAsync]
  );

  return (
    <FormProvider {...form}>
      <Screen flex={1} alignItems="center" justifyContent="center">
        <Card gap="$4" minWidth="90%" padding="$4" elevation="$2">
          <PartyPopper marginHorizontal="auto" size="$8" color="$primary" />
          <Text size="$8" textAlign="center">
            Willkommen bei PlanBuddy
          </Text>
          <Text size="$4" textAlign="center">
            Registriere dich hier mit deiner E-Mail, um Events beizutreten oder zu erstellen
          </Text>
          <FormInput name="email" placeholder="Deine E-Mail Addresse" />
          <PasswordInput name="password" placeholder="Dein Passwort" />
          <PasswordInput name="passwordAgain" placeholder="Wiederholung deines Passworts" />
          <Button
            onPress={form.handleSubmit(register)}
            iconAfter={isLoading && <ActivityIndicator />}
          >
            Einloggen
          </Button>
          <Separator borderWidth={0} borderBottomWidth={1} borderColor="$color.gray8Light" />
          <Text textAlign="center">
            Du bereits einen Account?{' '}
            <Link href="/login" replace>
              <Text color="$primary">Jetzt einloggen</Text>
            </Link>
          </Text>
        </Card>
      </Screen>
    </FormProvider>
  );
};
