import { t } from "i18next";
import { SizableText, View, XStack } from "tamagui";
import { Button } from "@/components/tamagui/Button";
import { Separator } from "@/components/tamagui/Separator";

type EventSelectStartEndProps = {
    onChangeStart: (date: Date) => void;
    onChangeEnd: (date: Date) => void;
    startDate: Date;
    endDate: Date;
};

export const EventSelectStartEnd = ({ onChangeStart, onChangeEnd, startDate, endDate }: EventSelectStartEndProps) => {
    /**
     * Gets the limits for the end date based on the start date. The end date must at least be one hour after the start date.
     */
    const getLimits = () => {
        const minimumDate = new Date(startDate);
        minimumDate.setHours(minimumDate.getHours() + 1);
        return { minuteLimit: { min: minimumDate.getMinutes() }, hourLimit: { min: minimumDate.getHours() } };
    };

    return (
        <View gap="$1.5">
            <View gap="$2" borderRadius="$4" padding="$2" backgroundColor="$accent">
                <View>
                    <XStack gap="$4" alignItems="center" justifyContent="space-between">
                        <SizableText>{t("events.start")}</SizableText>
                        <Button>Auswählen</Button>
                    </XStack>
                </View>
                <Separator borderColor="$background" />
                <View>
                    <XStack gap="$4" width="100%" alignItems="center" justifyContent="space-between">
                        <SizableText>{t("events.end")}</SizableText>
                        <Button>Auswählen</Button>
                    </XStack>
                </View>
            </View>
        </View>
    );
};
