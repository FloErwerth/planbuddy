export const formatToDate = (date?: Date | number | string) => {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(date);

  if (parsedDate.toString() === 'INVALID') {
    return undefined;
  }

  return parsedDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: '2-digit',
  });
};

const formatter = new Intl.DateTimeFormat();

export const formatToParts = (date?: Date | number | string) => {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(date);

  if (parsedDate.toString() === 'INVALID') {
    return undefined;
  }

  return formatter.formatToParts(parsedDate);
};

export const formatToTime = (date?: Date | number | string) => {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(date);

  if (parsedDate.toString() === 'INVALID') {
    return undefined;
  }

  return parsedDate.toLocaleTimeString('de-DE', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export function calcTimeUntilDate(targetDateTimestamp: number) {
  const now = new Date();
  const targetDate = new Date(targetDateTimestamp);
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const millisecondsPerMinute = 1000 * 60;

  // --- Calculate Precise Difference ---
  // Difference from *now* to the exact target time
  const preciseDiffMilliseconds = targetDate.getTime() - now.getTime();

  // 1. Check if event has passed
  if (preciseDiffMilliseconds < 0) {
    return;
  }

  // 2. Check if it's 2 or more calendar days away
  // Compare using the start of the respective days
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTargetDay = new Date(targetDate);
  startOfTargetDay.setHours(0, 0, 0, 0);

  const dayDiffMilliseconds = startOfTargetDay.getTime() - startOfToday.getTime();
  // Use Math.round for robustness, calculates difference between midnights
  const calendarDaysDiff = Math.round(dayDiffMilliseconds / millisecondsPerDay);

  if (calendarDaysDiff >= 2) {
    // If 2 or more full days away, just show days
    return `in ${calendarDaysDiff} ${calendarDaysDiff <= 1 ? 'Tag' : 'Tagen'}`;
  }

  // --- Handle Today / Tomorrow with Hour/Minute Precision ---
  // Since calendarDaysDiff < 2, we use the precise difference from now.

  // Calculate total remaining minutes, rounded UP to the nearest minute
  const totalMinutesRemaining = Math.ceil(preciseDiffMilliseconds / millisecondsPerMinute);

  if (totalMinutesRemaining === 0) {
    // Event is happening right now or within seconds
    return 'Less than a minute';
  }

  if (totalMinutesRemaining < 60) {
    // Less than 1 hour remaining
    return `in ${totalMinutesRemaining} ${totalMinutesRemaining <= 1 ? 'Minute' : 'Minuten'}`;
  }

  if (totalMinutesRemaining < 60) {
    // Weniger als 1 Stunde verbleibend: Nur Minuten anzeigen
    return `${totalMinutesRemaining} ${totalMinutesRemaining === 1 ? 'Minute' : 'Minuten'}`;
  } else {
    // 60 oder mehr Minuten verbleibend: Stunden und ggf. Minuten anzeigen
    const hours = Math.floor(totalMinutesRemaining / 60);
    const minutesPart = totalMinutesRemaining % 60; // Der Minutenanteil nach Abzug der vollen Stunden

    // Stunden formatieren (Singular/Plural)
    const stundenText = `${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`;

    if (minutesPart > 0) {
      // Minuten formatieren (Singular/Plural) und anhängen, falls vorhanden
      const minutenText = `${minutesPart} ${minutesPart === 1 ? 'Minute' : 'Minuten'}`;
      return `${stundenText}, ${minutenText}`;
    } else {
      // Nur Stunden ausgeben, wenn keine Restminuten vorhanden sind
      return stundenText;
    }
  }
}
