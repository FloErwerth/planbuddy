import { supabase } from "@/api/supabase";
import { decode } from "base64-arraybuffer";

export const uploadEventImageSupabaseQuery = async (eventId: string, base64: string) => {
	await supabase.storage.from("event-images").upload(`${eventId}/image.png?bust=${Date.now()}`, decode(base64), {
		upsert: true,
		contentType: "image/png",
	});
};
