import { supabase } from "@/api/supabase";
import { User } from "@/api/user/types";

export const updateUserSupabaseQuery = async (updatedUser: Partial<User>) => {
	return await supabase.from("users").update(updatedUser).eq("id", updatedUser.id).select();
};
