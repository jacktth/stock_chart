import { useQuery } from "react-query";
import useSupabase from "./useSupabase";

export function useUserQuery() {
    const client = useSupabase();
    const key = ['userId'];
  
    return useQuery(key, () => {
      return client.auth.getUser().then(
        (result) => result.data.user
      );
    });
  }
  