import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateCategoriesQuery } from "../api/queries/updateCategoryQuery";
import { useAppDispatch } from "../app/hooks";
import { addCategories } from "../features/listingBar/listSlice";
import useSupabase from "./useSupabase";

type addForm = {
  name: string;
  userId: string;
};
export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

 

  const client = useSupabase();
  return useMutation(
    async (form: addForm) => {
      return updateCategoriesQuery(client, form).then((result: any) => {
        console.log("result", result);
        return result.data;
      });
    },
    {
      onSuccess(data, variables, context) {
        queryClient.refetchQueries(["categories"]);
        queryClient.invalidateQueries(["categories"]);
      },
    }
  );
}
