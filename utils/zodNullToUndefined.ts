import { ZodSchema } from "zod";

export const zodNullToUndefined = (schema: ZodSchema) => schema.transform((schema) => (schema !== null ? schema : undefined)).optional();
