import { Calendar } from "@/components/Calendar";
import { HeightTransition } from "@/components/HeightTransition";
import { timePartialsWithoutTimeZone } from "@/utils/date";
import { EventTimerPicker } from "./EventTimerPicker";

type EventSelectStartEndProps = {
	showCalendar: boolean;
	showTimePicker: boolean;
	date: Date;
	minimumDate?: Date;
	maximumDate?: Date;
	setDate: (date: Date) => void;
	setTime: (dateWithTime: Date) => void;
};

export const EventSelectStartEnd = ({ date, minimumDate, setDate, showCalendar, showTimePicker, setTime }: EventSelectStartEndProps) => {
	const getLimits = () => {
		if (!minimumDate) {
			return undefined;
		}

		const minimumDatePartials = timePartialsWithoutTimeZone(minimumDate);
		const datePartials = timePartialsWithoutTimeZone(date);

		if (minimumDatePartials.date !== datePartials.date) {
			return undefined;
		}

		return { minuteLimit: { min: minimumDate.getMinutes() }, hourLimit: { min: minimumDate.getHours() } };
	};

	return (
		<>
			<HeightTransition paddingBottom="$4" paddingTop="$2" open={showCalendar}>
				<Calendar date={date} onDateSelected={setDate} minimumDate={minimumDate} />
			</HeightTransition>
			<HeightTransition paddingTop="$2" alignSelf="center" open={showTimePicker}>
				<EventTimerPicker
					initialValue={{ hours: date.getHours(), minutes: date.getMinutes() }}
					{...getLimits()}
					allowFontScaling={false}
					decelerationRate="normal"
					onDurationChange={(duration) => {
						const dateWithSetTime = new Date(date);
						dateWithSetTime.setHours(duration.hours);
						dateWithSetTime.setMinutes(duration.minutes);
						setTime(dateWithSetTime);
					}}
				/>
			</HeightTransition>
		</>
	);
};
