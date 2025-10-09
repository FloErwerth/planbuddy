import type { ParseKeys } from "i18next";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { SizeableText } from "@/components/tamagui/Text/SizeableText";

type TranslatedTextProps = Omit<ComponentProps<typeof SizeableText>, "children"> & { translationKey: ParseKeys };
export const TranslatedText = ({ translationKey, ...props }: TranslatedTextProps) => {
	const { t } = useTranslation();
	return <SizeableText {...props}>{t(translationKey)}</SizeableText>;
};
