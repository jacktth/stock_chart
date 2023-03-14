import { useMutation, useQueryClient,  } from "react-query";
import { deleteUserClipQuery } from "../api/queries/deleteUserClipQuery";
import useSupabase from "./useSupabase";

type deleteCategoryParam = {
  categoryName: string;
  userId: string;
};

export function useDeleteUserCategoriesMutation(){
  const client = useSupabase();
  const queryClient = useQueryClient();

  const key = ["clip"];
  

  return useMutation(
     ({userId,categoryName}:deleteCategoryParam) => {
      return deleteUserClipQuery(client,userId, categoryName).then((result)=>result);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey:key });
      },
    }
  );
}
