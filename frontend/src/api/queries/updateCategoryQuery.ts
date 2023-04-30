import { SupabaseClient } from "@supabase/supabase-js";
import { insertCategoryQueryParam } from "../../hooks/useUpdateUserCategoyMutation";

export async function updateCategoriesQuery(
  client: SupabaseClient,
  params: insertCategoryQueryParam
) {
  const {error} = await client
    .from("categories")
    .upsert({ name: params.name, user_id: params.userId,default:params.default })
    .select("*");
    
  return error
}
