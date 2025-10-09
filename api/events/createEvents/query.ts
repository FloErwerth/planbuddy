import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import type { AppEvent } from "@/api/events/types";
import { supabase } from "@/api/supabase";

/**
 * Creates an event in the database
 */
export const createEventSupabaseQuery = async (event: Omit<AppEvent, "id" | "createdAt">, userId: string): Promise<PostgrestSingleResponse<AppEvent>> => {
  return await supabase
    .from("events")
    .insert({ ...event, creatorId: userId })
    .select()
    .single()
    .throwOnError();
};
