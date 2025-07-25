import { router } from 'expo-router';
import { Screen } from '@/components/Screen';
import { debounce, SizableText } from 'tamagui';
import { Button } from '@/components/tamagui/Button';

export default function InitialAppScreen() {
    return (
        <Screen flex={1} justifyContent="center">
            <SizableText size="$12" textAlign="center">
                PlanBuddy
            </SizableText>
            <SizableText size="$8" textAlign="center">
                Events erstellen, Freunde einladen und gemeinsam feiern
            </SizableText>
            <Button onPress={debounce(() => router.push('/authentication/token'), 200, true)}>Anmelden</Button>
        </Screen>
    );
}
