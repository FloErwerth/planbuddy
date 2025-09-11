import { supabase } from "@/api/supabase";
import { User } from "@/api/types";

export const updateUserSupabaseQuery = async (updatedUser: User) => {
	return await supabase.from("users").update(updatedUser).eq("id", updatedUser.id).select();
};
