import { useQuery, UseQueryResult } from "react-query";
import { getUserApiKeyQuery } from "../api/queries/getUserApiKeyQuery";
import { getUserCategoriesQuery } from "../api/queries/getUserCategoriesQuery";
import useSupabase from "./useSupabase";

export function useApiKeyQuery(userId: string){
  const client = useSupabase();
  const key = ["apiKey"];

  return useQuery({
    queryKey: key,
    queryFn: () => getUserApiKeyQuery(client, userId),
   
  });
}
