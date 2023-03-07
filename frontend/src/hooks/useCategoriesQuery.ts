import { useQuery } from "react-query";
import { getUserCategoriesQuery } from "../api/queries/getUserCategoriesQuery";
import useSupabase from "./useSupabase";

export function useCategoriesQuery(userId: string) {
  const client = useSupabase();
  const key = ["categories"];
  return useQuery(key,async  () => {
    getUserCategoriesQuery(client, userId).then((result) => result.data);
  });
}
