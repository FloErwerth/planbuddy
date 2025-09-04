import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { router } from "expo-router";
import { debounce, SizableText } from "tamagui";

export default function InitialAppScreen() {
	return (
		<Screen flex={1} justifyContent="center">
			<SizableText size="$12" textAlign="center">
				PlanBuddy
			</SizableText>
			<SizableText size="$8" textAlign="center">
				Events erstellen, Freunde einladen und gemeinsam feiern
			</SizableText>
			<Button onPress={debounce(() => router.push("/authentication"), 200, true)}>Anmelden</Button>
		</Screen>
	);
}
