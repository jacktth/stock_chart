import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

export async function deleteUserCategoryQuery(
  client: SupabaseClient<Database>,
  userId: string,
  name: string
) {
  const { status: categories } = await client
    .from("categories")
    .delete()
    .eq("user_id", userId)
    .eq("name", name);
  const { status: clip } = await client
    .from("clip")
    .delete()
    .eq("category", name)
    .eq("user_id", userId);
console.log("status ",{ clipStatus: categories, categoriesStatus: clip });

  return { clipStatus: categories, categoriesStatus: clip };
}
