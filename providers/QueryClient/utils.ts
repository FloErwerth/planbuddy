export const isoDateRegex = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2}))?$/;

export const dateDeserializer = (_: string, value: unknown) => {
    if (typeof value === "string") {
        if (isoDateRegex.test(value)) {
            const date = new Date(value);
            // Check for invalid dates to avoid parsing non-date strings that match the regex
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    }
    return value;
};
