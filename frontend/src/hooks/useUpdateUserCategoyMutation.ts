import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateCategoriesQuery } from "../api/queries/updateCategoryQuery";
import { useAppDispatch } from "../app/hooks";
import { addCategories } from "../features/listingBar/listSlice";
import useSupabase from "./useSupabase";

export type insertCategoryQueryParam = {
  name: string;
  userId: string;
  default:boolean;
};
export function useUpdateUserCategoryMutation() {
  const queryClient = useQueryClient();

  const client =  useSupabase();
  return useMutation(
    async (params: insertCategoryQueryParam) => {
      return updateCategoriesQuery(client, params)
    },
    {
      onSuccess(data) {
        queryClient.invalidateQueries({ queryKey:["categories"] });
        if(data?.message != null){
          alert(data.message)
        }
        
      },
    }
  );
}
