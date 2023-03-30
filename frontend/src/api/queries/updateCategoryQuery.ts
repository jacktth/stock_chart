import { SupabaseClient } from "@supabase/supabase-js";
import { insertCategoryQueryParam } from "../../hooks/useUpdateUserCategoyMutation";

export function updateCategoriesQuery(
  client: SupabaseClient,
  params: insertCategoryQueryParam
) {
  console.log("params",params)
  return client
    .from("categories")
    .upsert({ name: params.name, user_id: params.userId,default:params.default })
    .select("*");
}
