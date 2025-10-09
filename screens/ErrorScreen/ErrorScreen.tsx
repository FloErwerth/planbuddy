import { SizableText } from "tamagui";
import { Screen } from "@/components/Screen";
import { useTranslation } from "@/hooks/useTranslation";

export const ErrorScreen = () => {
	const { t } = useTranslation();

	return (
		<Screen>
			<SizableText>{t("common.error")}</SizableText>
		</Screen>
	);
};
