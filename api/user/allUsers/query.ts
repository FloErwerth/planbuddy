import { supabase } from "@/api/supabase";

export const allUsersSupabaseQuery = async () => {
	return await supabase.from("users").select("*").throwOnError();
};
