import type { AppEvent } from "@/api/events/types";
import { supabase } from "@/api/supabase";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * Updates an event in the database.
 */
export const updateEventSupabaseQuery = async (event: Partial<AppEvent>): Promise<PostgrestSingleResponse<AppEvent>> => {
	return await supabase.from("events").update(event).eq("id", event.id).select().single().throwOnError();
};
