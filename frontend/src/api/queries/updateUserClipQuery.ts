import { SupabaseClient } from "@supabase/supabase-js";
import { SelectedData } from "../../features/saveBar/SaveBar";

//This place should be use object to replace because the wrong input rank of the variables will cause mismatching
export function updateUserClipQuery(
  client: SupabaseClient,
  selectedData: SelectedData,
  userId: string,
  category: string,
  symbol: string,
  market: string
) {
  //   console.log("params",params)
  return client
    .from("clip")
    .upsert({
      starting: selectedData.starting,
      ending: selectedData.ending,
      user_id: userId,
      category: category,
      symbol: symbol,
      market: market,
    })
    .select();
}
