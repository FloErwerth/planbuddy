import { Button, Text } from '@/components/tamagui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { GradientScreen } from '@/components/Screen';
import { Card, Separator } from 'tamagui';
import { PartyPopper } from '@tamagui/lucide-icons';
import { ValidatedInput } from '@/components/ValidatedInput';
import { Link } from 'expo-router';
import { useLoginUserMutation } from '@/api/query/user';
import { ActivityIndicator } from 'react-native';

const loginSchema = z.object({
  email: z
    .string({ message: 'Bitte gib eine gültige E-Mail-Addresse ein.' })
    .email({ message: 'Bitte gib eine gültige E-Mail-Addresse ein.' }),
  password: z
    .string({ message: 'Ein Passwort ist für deinen Account notwendig.' })
    .min(5, { message: 'Bitte gib mindestens 5 Zeichen ein.' }),
});
type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(loginSchema),
  });
  const { mutate, isLoading } = useLoginUserMutation();
  const login = (data: LoginSchema) => {
    mutate({ ...data });
  };

  return (
    <GradientScreen alignItems="center" justifyContent="center" height="100%">
      <Card gap="$4" minWidth="90%" padding="$4" elevation="$2">
        <PartyPopper marginHorizontal="auto" size="$8" color="$primary" />
        <Text size="$8" textAlign="center">
          Willkommen zurück bei PlanBuddy
        </Text>
        <Text size="$4" textAlign="center">
          Gib deine E-Mail und dein Passwort ein, um dich einzuloggen
        </Text>
        <ValidatedInput control={control} name="email" placeholder="Deine E-Mail Addresse" />
        <ValidatedInput
          secureTextEntry
          control={control}
          name="password"
          showErrorMessage
          placeholder="Dein Passwort"
        />
        <Button onPress={handleSubmit(login)} iconAfter={isLoading && <ActivityIndicator />}>
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
    </GradientScreen>
  );
}
