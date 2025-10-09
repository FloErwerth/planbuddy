import { useTranslation } from "react-i18next";
import { TimerPicker, type TimerPickerProps } from "react-native-timer-picker";
import { SizeableText } from "@/components/tamagui/Text";
import { getIs24HourFormat } from "@/utils/translation";

export const EventTimerPicker = (props: TimerPickerProps) => {
	const { t } = useTranslation();
	return (
		<TimerPicker
			{...props}
			hourLabel={
				<SizeableText left={17} size="$7">
					:
				</SizeableText>
			}
			minuteLabel={
				<SizeableText marginTop={1} left={38} fontSize={24}>
					{t("common.oclock")}
				</SizeableText>
			}
			use12HourPicker={!getIs24HourFormat()}
			hideSeconds
			styles={{
				backgroundColor: "transparent",
				pickerItem: {
					justifyContent: "center",
					padding: 0,
					margin: 0,
					fontSize: 24,
				},
				pickerLabelContainer: {
					padding: 0,
					margin: 0,
				},
				pickerItemContainer: {
					justifyContent: "center",
					alignItems: "center",
					width: 60,
				},
				pickerContainer: {
					width: 300,
					alignItems: "center",
					padding: 0,
					margin: 0,
					justifyContent: "center",
					marginRight: 6,
				},
			}}
			{...props}
		/>
	);
};
