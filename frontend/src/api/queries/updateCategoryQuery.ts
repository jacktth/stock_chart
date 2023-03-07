import { SupabaseClient } from "@supabase/supabase-js";

export function updateCategoriesQuery(
  client: SupabaseClient,
  params: { name: string; userId: string }
) {
  console.log("params",params)
  return client
    .from("categories")
    .upsert({ name: params.name, user_id: params.userId })
    .select("*");
}
