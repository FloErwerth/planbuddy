import { TimerPicker, type TimerPickerProps } from "react-native-timer-picker";
import { SizeableText } from "@/components/tamagui/Text";

export const EventTimerPicker = (props: TimerPickerProps) => {
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
					Uhr
				</SizeableText>
			}
			use12HourPicker={false}
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
