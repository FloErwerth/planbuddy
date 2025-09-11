import { supabase } from "@/api/supabase";
import { User } from "@/api/types";

export const insertUserSupabaseQuery = async (insertedUser: User) => {
	return await supabase
		.from("users")
		.insert({ id: insertedUser.id, ...insertedUser })
		.select();
};
