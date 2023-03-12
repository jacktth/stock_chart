import { useQuery, UseQueryResult } from "react-query";
import { getUserCategoriesQuery } from "../api/queries/getUserCategoriesQuery";
import useSupabase from "./useSupabase";

export function useCategoriesQuery(userId: string){
  const client = useSupabase();
  const key = ["categories"];

  return useQuery({
    queryKey: key,
    queryFn: () => getUserCategoriesQuery(client, userId),
  });
}
