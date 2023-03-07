import { useQuery } from "react-query";
import { getUserCategoriesQuery } from "../api/queries/getUserCategoriesQuery";
import useSupabase from "./useSupabase";

export function useCategoriesQuery(userId: string) {
  const client = useSupabase();
  const key = ["userId"];

  return useQuery(key, () => {
    getUserCategoriesQuery(client, userId).then((result) => result.data);
  });
}
