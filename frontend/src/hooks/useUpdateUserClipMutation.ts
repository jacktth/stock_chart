import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateCategoriesQuery } from "../api/queries/updateCategoryQuery";
import { updateUserClipQuery } from "../api/queries/updateUserClipQuery";
import { useAppDispatch } from "../app/hooks";
import { addCategories } from "../features/listingBar/listSlice";
import useSupabase from "./useSupabase";

type updateClipParam = {
  selectedData: { starting: number; ending: number };
  category: string;
  symbol: string;
  userId: string;
  market: string;
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

        param.market
      ).then((result: any) => {
        console.log("result", result);
        return result.data;
      });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["clips"] });
      },
    }
  );
}
