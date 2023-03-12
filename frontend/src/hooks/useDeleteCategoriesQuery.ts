import { useQuery, useQueryClient,  } from "react-query";
import { deleteUserCategoryQuery } from "../api/queries/delectUserCategoryQuery";
import useSupabase from "./useSupabase";

export function useDeleteCategoriesQuery(userId: string,name:string){
  const client = useSupabase();
  const queryClient = useQueryClient();

  const key = ["categories"];

  return useQuery({
    queryKey: key,
    queryFn: () => deleteUserCategoryQuery(client, userId,name),
    onSuccess() {
        queryClient.invalidateQueries({ queryKey:["categories"] });
      },
  });
}
