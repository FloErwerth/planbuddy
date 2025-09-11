import { supabase } from "@/api/supabase";
import { decode } from "base64-arraybuffer";

export const uploadProfilePictureSupabaseQuery = async (userId: string, base64: string) => {
	await supabase.storage.from("profile-images").update(`${userId}/profileImage.png?bust=${Date.now()}`, decode(base64), {
		upsert: true,
		contentType: "image/png",
	});
};
