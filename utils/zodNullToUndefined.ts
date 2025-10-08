import type { ZodSchema } from "zod";

export const zodNullToUndefined = <T>(schema: ZodSchema<T>) => schema.transform((schema) => (schema !== null ? schema : undefined)).optional();
