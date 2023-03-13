import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateCategoriesQuery } from "../api/queries/updateCategoryQuery";
import { useAppDispatch } from "../app/hooks";
import { addCategories } from "../features/listingBar/listSlice";
import useSupabase from "./useSupabase";

type addForm = {
  name: string;
  userId: string;
};
export function useUpdateUserCategoryMutation() {
  const queryClient = useQueryClient();

  const client = useSupabase();
  return useMutation(
    async (form: addForm) => {
      return updateCategoriesQuery(client, form).then((result: any) => {
        return result.data;
      });
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey:["categories"] });
      },
    }
  );
}
