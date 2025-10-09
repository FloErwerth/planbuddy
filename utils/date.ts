export function getRelativeDate(date: Date): string {
	// Get the current date and time
	const now = new Date();
	// Create a Date object from the provided timestamp
	const targetDate = new Date(date.valueOf());

	// Create new Date objects for comparison, setting time to 00:00:00 for accurate day-based calculations
	const today = new Date(now);
	today.setHours(0, 0, 0, 0);

	const targetDay = new Date(targetDate);
	targetDay.setHours(0, 0, 0, 0);

	// Calculate the difference in milliseconds between the target day and today
	const diffTime = targetDay.getTime() - today.getTime();
	// Convert milliseconds to days, rounding to the nearest whole day
	const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

	// Handle "today" and "tomorrow"
	if (diffDays === 0) {
		return "heute";
	}
	if (diffDays === 1) {
		return "morgen";
	}
	if (diffDays < 0) {
		// Handle past dates
		if (diffDays === -1) {
			return "gestern";
		}
		return "in der Vergangenheit"; // Or you could return a specific date string, e.g., targetDate.toLocaleDateString()
	}

	// --- Calculate Week-based Differences ---

	// Get the day of the week for today (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
	const currentDayOfWeek = today.getDay();
	// Calculate days since the most recent Monday (adjusting for Sunday being 0)
	const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
	// Get the date of the Monday of the current week
	const startOfCurrentWeek = new Date(today);
	startOfCurrentWeek.setDate(today.getDate() - daysSinceMonday);
	startOfCurrentWeek.setHours(0, 0, 0, 0); // Ensure time is reset

	// Get the day of the week for the target date
	const targetDayOfWeek = targetDay.getDay();
	// Calculate days since the most recent Monday for the target date
	const targetDaysSinceMonday = targetDayOfWeek === 0 ? 6 : targetDayOfWeek - 1;
	// Get the date of the Monday of the target date's week
	const startOfTargetWeek = new Date(targetDay);
	startOfTargetWeek.setDate(targetDay.getDate() - targetDaysSinceMonday);
	startOfTargetWeek.setHours(0, 0, 0, 0); // Ensure time is reset

	// Calculate the difference in weeks between the start of the current week and the start of the target week
	const weeksDifference = Math.round((startOfTargetWeek.getTime() - startOfCurrentWeek.getTime()) / (1000 * 60 * 60 * 24 * 7));

	// Handle "this week", "next week", "in 2 weeks", "in 3 weeks"
	if (weeksDifference === 0) {
		return "diese Woche";
	}
	if (weeksDifference === 1) {
		return "nächste Woche";
	}
	if (weeksDifference === 2) {
		return "in 2 Wochen";
	}
	if (weeksDifference === 3) {
		return "in 3 Wochen";
	}

	// --- Calculate Month-based Differences ---

	// Get the month and year of today
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();
	// Get the month and year of the target date
	const targetMonth = targetDay.getMonth();
	const targetYear = targetDay.getFullYear();

	// Calculate the difference in calendar months
	const monthDiff = (targetYear - currentYear) * 12 + (targetMonth - currentMonth);

	// Handle "in one month" and "in X months"
	if (monthDiff === 1) {
		return "in einem Monat";
	}
	if (monthDiff > 1 && monthDiff <= 12) {
		return `in ${monthDiff} Monaten`;
	}

	// --- Calculate Year-based Differences ---

	// Calculate the difference in calendar years
	const yearDiff = targetYear - currentYear;

	// Handle "in one year" and "in X years"
	if (yearDiff === 1) {
		return "in einem Jahr";
	}
	if (yearDiff > 1) {
		return `in ${yearDiff} Jahren`;
	}

	// Fallback for very distant future dates not covered by the specific phrases
	// This should ideally not be reached if all cases are covered, but provides a safe return.
	return targetDate.toLocaleDateString();
}

export const formatToDate = (date?: Date | number | string) => {
	if (!date) {
		return undefined;
	}

	const parsedDate = new Date(date);

	if (parsedDate.toString() === "INVALID") {
		return undefined;
	}

	// enable with support of english
	return parsedDate.toLocaleDateString("de-DE", {
		day: "2-digit",
		month: "long",
		year: "2-digit",
	});
};

export const formatToTime = (date?: Date | number | string) => {
	if (!date) {
		return undefined;
	}

	const parsedDate = new Date(date);

	if (parsedDate.toString() === "INVALID") {
		return undefined;
	}

	return parsedDate.toLocaleTimeString("de-DE", {
		hour: "numeric",
		minute: "2-digit",
	});
};

export const timePartialsWithoutTimeZone = (date: Date) => {
	const userTimezoneOffset = date.getTimezoneOffset() * 60000;
	const dateWithoutTimeZone = new Date(date.getTime() + userTimezoneOffset);

	const splitt = dateWithoutTimeZone.toISOString().split("T");

	return { date: splitt[0], time: splitt[1] };
};
