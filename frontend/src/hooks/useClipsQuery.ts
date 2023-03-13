import { useQuery,  } from "react-query";
import { getUserClipQuery } from "../api/queries/getUserClipQuery";
import useSupabase from "./useSupabase";

export function useClipsQuery(userId: string){
  const client = useSupabase();
  const key = ["clip"];
  console.log("clip query");
  
  return useQuery({
    queryKey: key,
    queryFn: () => getUserClipQuery(client, userId),
  });
}
