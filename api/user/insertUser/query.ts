import { supabase } from "@/api/supabase";
import type { User } from "@/api/user/types";

export const insertUserSupabaseQuery = async (insertedUser: Partial<User>) => {
	return await supabase.from("users").insert(insertedUser).select();
};
