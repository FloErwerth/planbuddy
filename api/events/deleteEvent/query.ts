import { AppEvent } from "@/api/events/types";
import { supabase } from "@/api/supabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export const deleteEventSupabaseQuery = async (eventId: string): Promise<PostgrestSingleResponse<AppEvent>> => {
	return await supabase.from("events").delete().eq("id", eventId).select().single().throwOnError();
};

export const deleteEventImageSupabaseQuery = async (eventId: string) => {
	return await supabase.storage.from("event-images").remove([`${eventId}/image.png`]);
};
