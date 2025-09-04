import { useState } from "react";
type TimePickerProps = {
	startDate?: Date;
	endDate?: Date;
};
export const useStartEndTimePickers = ({ startDate, endDate }: TimePickerProps = {}) => {
	const now = new Date();
	const [showStartCalendar, setShowStartCalendar] = useState(false);
	const [showStartTime, setShowStartTime] = useState(false);
	const [showEndCalendar, setShowEndCalendar] = useState(false);
	const [showEndTime, setShowEndTime] = useState(false);
	const [start, setStart] = useState<Date>(startDate ?? now);
	const [end, setEnd] = useState<Date>(
		(() => {
			const newEnd = new Date(now);
			newEnd.setHours(now.getHours() + 3);
			return endDate ?? newEnd;
		})()
	);

	const handleOpenStartDate = () => {
		setShowStartTime(false);
		setShowEndCalendar(false);
		setShowEndTime(false);
		setShowStartCalendar((open) => !open);
	};

	const handleOpenStartTime = () => {
		setShowStartCalendar(false);
		setShowEndCalendar(false);
		setShowEndTime(false);
		setShowStartTime((open) => !open);
	};

	const handleOpenEndDate = () => {
		setShowStartCalendar(false);
		setShowStartTime(false);
		setShowEndTime(false);
		setShowEndCalendar((open) => !open);
	};

	const handleOpenEndTime = () => {
		setShowStartCalendar(false);
		setShowStartTime(false);
		setShowEndCalendar(false);
		setShowEndTime((open) => !open);
	};

	const handleSetStartDate = (newDate: Date) => {
		const newStart = new Date(newDate);

		// get the current set hours and minutes from the time picker
		newStart.setHours(start.getHours());
		newStart.setMinutes(start.getMinutes());

		setStart(newStart);

		if (newStart > end) {
			handleSetEndDate(newStart);
		}
	};

	const handleSetStartTime = (newTimeDate: Date) => {
		setStart(newTimeDate);

		if (newTimeDate > end) {
			setEnd(newTimeDate);
		}
	};

	const handleSetEndDate = (newDate: Date) => {
		const newEnd = new Date(newDate);

		// get the current set hours and minutes from the time picker
		newEnd.setHours(start.getHours());
		newEnd.setMinutes(start.getMinutes());
		setEnd(newEnd);
	};

	return {
		startDate: start,
		endDate: end,
		startPicker: {
			date: {
				setStartDate: handleSetStartDate,
				showStartCalendar: handleOpenStartDate,
				isStartCalendarOpen: showStartCalendar,
			},
			time: {
				showStartTime: handleOpenStartTime,
				isStartTimeOpen: showStartTime,
				setStartTime: handleSetStartTime,
			},
		},
		endPicker: {
			date: {
				setEndDate: handleSetEndDate,
				showEndCalendar: handleOpenEndDate,
				isEndCalendarOpen: showEndCalendar,
			},
			time: {
				showEndTime: handleOpenEndTime,
				isEndTimeOpen: showEndTime,
				setEndTime: setEnd,
			},
		},
	};
};
