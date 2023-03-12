import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function deleteUserCategoryQuery(
  client: SupabaseClient<Database>,
  userId: string,
  name:string
) {
  const { data } = await client.from("categories").delete().eq("user_id", userId).eq("name",name);

  return data;
}
