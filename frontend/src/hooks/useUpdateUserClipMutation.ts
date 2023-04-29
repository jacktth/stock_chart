import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateCategoriesQuery } from "../api/queries/updateCategoryQuery";
import { updateUserClipQuery } from "../api/queries/updateUserClipQuery";
import { useAppDispatch } from "../app/hooks";
import { addCategories } from "../features/listingBar/listSlice";
import useSupabase from "./useSupabase";

type updateClipParam = {
  selectedData: { starting: number | null; ending: number | null };
  category: string;
  symbol: string;
  userId: string;
  market: string;
  category_id: number;
};
export function useUpdateUserClipMutation() {
  const queryClient = useQueryClient();
  
  const client = useSupabase();
  return useMutation(
    async (param: updateClipParam) => {
      return updateUserClipQuery(
        client,
        param.selectedData,
        param.userId,
        param.category,
        param.symbol,
        param.market,
        param.category_id
      ).then((result: any) => {
        return result.data;
      });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["clip"] });
      },
    }
  );
}
