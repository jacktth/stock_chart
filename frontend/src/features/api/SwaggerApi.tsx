import { Session } from "@supabase/supabase-js";
import React from "react";
import { useQueryClient } from "react-query";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { supabase } from "../../api/supabaseClient";
import { useAppDispatch } from "../../app/hooks";
import { useApiKeyQuery } from "../../hooks/useApiKeyQuery";
import useSupabase from "../../hooks/useSupabase";
import { changePage } from "../Page/pageSlice";

export const SwaggerApi = ({ session }: { session: Session }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const client = useSupabase()
  const { data, error, isLoading } = useApiKeyQuery(session.user.id);
  async function updateApiKey() {
    console.log("sssss",session.user.id);

    const {data:res} = await client.rpc("update_user_api_key")
    console.log("sss",res);
    
    queryClient.invalidateQueries({ queryKey:["apiKey"] });
  }
  function copyToClipboard() {
    if (data) return navigator.clipboard.writeText(data[0].api_key);
  }
  function apiKey() {
    if (isLoading) return <>loading...</>;
    if (data) {
      return (
        <div>
          <button onClick={() => dispatch(changePage("chartPage"))}>
            Back to your chart
          </button>
          <input type="password" value={data[0].api_key} disabled></input>
          <button onClick={() => copyToClipboard()}>copy</button>
          <button
            onClick={() =>
              updateApiKey()
            }
          >
            Generate new Api key
          </button>
          <SwaggerUI url="http://localhost:3000/api-json" />
        </div>
      );
      if (error) return <>Server error, please contact the admin</>;
    }
  }

  return <>{apiKey()}</>;
};
