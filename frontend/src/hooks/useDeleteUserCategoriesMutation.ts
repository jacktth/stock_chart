import { useMutation, useQueryClient,  } from "react-query";
import { deleteUserCategoryQuery } from "../api/queries/delectUserCategoryQuery";
import useSupabase from "./useSupabase";

type deleteCategoryParam = {
  categoryName: string;
  userId: string;
};

export function useDeleteUserCategoriesMutation(){
  const client = useSupabase();
  const queryClient = useQueryClient();

  const key = ["categories","clip"];
  

  return useMutation(
     ({userId,categoryName}:deleteCategoryParam) => {
      return deleteUserCategoryQuery(client,userId, categoryName).then((result)=>result);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey:key });
      },
    }
  );
}
