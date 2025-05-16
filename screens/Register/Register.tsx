import {Card, Separator} from "tamagui";
import {PartyPopper} from "@tamagui/lucide-icons";
import {Button, Text} from "@/components/tamagui";
import {ValidatedInput} from "@/components/ValidatedInput";
import {ActivityIndicator} from "react-native";
import {Link} from "expo-router";
import {GradientScreen} from "@/components/Screen";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {registerSchema, RegisterSchema} from "@/screens/Authentication/schemas";
import { useRegisterUserMutation} from "@/api/query/user";
import {useCallback} from "react";

export const Register = () => {
    const { control, handleSubmit } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const { mutate, isLoading } = useRegisterUserMutation();

    const register = useCallback((data: RegisterSchema) => {
        mutate({ email: data.email, password: data.password });
    }, [mutate]);

    return <GradientScreen alignItems="center" justifyContent="center" height="100%">
        <Card gap="$4" minWidth="90%" padding="$4" elevation="$2">
            <PartyPopper marginHorizontal="auto" size="$8" color="$primary" />
            <Text size="$8" textAlign="center">
                Willkommen zurück bei PlanBuddy
            </Text>
            <Text size="$4" textAlign="center">
                Registriere dich hier mit deiner E-Mail, um Events beizutreten oder zu erstellen
            </Text>
            <ValidatedInput control={control} name="email" placeholder="Deine E-Mail Addresse" showErrorMessage />
            <ValidatedInput
                secureTextEntry
                control={control}
                name="password"
                showErrorMessage
                placeholder="Dein Passwort"
            />
            <ValidatedInput
                secureTextEntry
                control={control}
                name="passwordAgain"
                showErrorMessage
                placeholder="Wiederholung deines Passworts"
            />
            <Button onPress={handleSubmit(register)} iconAfter={isLoading && <ActivityIndicator />}>
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
}
