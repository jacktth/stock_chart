import { useMutation, useQueryClient,  } from "react-query";
import { deleteUserClipQuery } from "../api/queries/deleteUserClipQuery";
import useSupabase from "./useSupabase";

type deleteClipParam = {
  userId:string;
  clipId:number;
};

export function useDeleteUserClipMutation(){
  const client = useSupabase();
  const queryClient = useQueryClient();

  const key = ["clip"];
  

  return useMutation(
     ({userId ,clipId}:deleteClipParam) => {
      return deleteUserClipQuery(client ,clipId,userId).then((result)=>result);
    },
    {
      onSuccess() {
        queryClient.invalidateQueries({ queryKey:key });
      },
    }
  );
}
