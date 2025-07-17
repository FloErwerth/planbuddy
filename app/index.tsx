import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { debounce, SizableText } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { useCheckLoginState } from '@/hooks/useCheckLoginState';

export default function InitialAppScreen() {
    useCheckLoginState();

    return (
        <Screen flex={1} justifyContent="center">
            <SizableText size="$12" textAlign="center">
                PlanBuddy
            </SizableText>
            <SizableText size="$8" textAlign="center">
                Events erstellen, Freunde einladen und gemeinsam feiern
            </SizableText>
            <Button onPress={debounce(() => router.push('/token'), 200, true)}>Anmelden</Button>
        </Screen>
    );
}
