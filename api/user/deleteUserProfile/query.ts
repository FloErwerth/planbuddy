import { supabase } from "@/api/supabase";

export const deleteUserProfilePictureSupabaseQuery = async (userId: string) => {
	return await supabase.storage.from("profile-images").update(`${userId}/profileImage.png?bust=${Date.now()}`, "");
};
