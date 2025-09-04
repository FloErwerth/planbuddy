export type CalendarProps = {
	date: Date;
	onDateSelected: (date: Date) => void;
	minimumDate?: Date;
	maximumDate?: Date;
};
