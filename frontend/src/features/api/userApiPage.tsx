import { Session } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "react-query";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { supabase } from "../../api/supabaseClient";
import { useAppDispatch } from "../../app/hooks";
import { useApiKeyQuery } from "../../hooks/useApiKeyQuery";
import useSupabase from "../../hooks/useSupabase";
import { changePage } from "../Page/pageSlice";
import { categoryApiParams, clipsApiParams } from "./utilies";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import ApiColumn from "./apiColumn";
import LoadingComponent from "../commonUI/loadingComponent";

const UserApiPage = ({ session }: { session: Session }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const client = useSupabase();
  const [loadingApiKey, setLoadingApiKey] = useState(false);
  const { data, error, isLoading } = useApiKeyQuery(session.user.id);

  async function updateApiKey() {
    const { data: res } = await client.rpc("update_user_api_key");

    queryClient.invalidateQueries({ queryKey: ["apiKey"] });
    setLoadingApiKey(false);
  }

  function copyToClipboard() {
    if (data) return navigator.clipboard.writeText(data[0].api_key);
  }

  const KeyUi = () => {
    if (isLoading) return <LoadingComponent />;
    if (data) {
      return (
        <div className="leading-normal ">
          <p className="text-3xl text-stone-900 pb-2">Your Api Key</p>
          {loadingApiKey ? (
            <LoadingComponent />
          ) : (
            <div
              className="flex
        space-x-5"
            >
              <input
                className="bg-slate-500"
                type="password"
                value={data[0].api_key}
                disabled
              ></input>
              <button className="button" onClick={() => copyToClipboard()}>
                Copy
              </button>
              <button
                className="button"
                onClick={() => {
                  updateApiKey();
                  setLoadingApiKey(true);
                }}
              >
                Generate new Api key
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return <>Server error, please contact the admin</>;
    }
  };

  return (
    <div className="">
      <button
        className="flex items-center menuButton"
        onClick={() => dispatch(changePage("chartPage"))}
      >
        <div>
          <KeyboardBackspaceIcon sx={{ fontSize: 30 }} />
        </div>
        <div className="font-bold">Back to chart</div>
      </button>

      <div className="text-stone-900 p-4 ">
        <p className="text-4xl mx-4 my-4">API Page</p>
        <p className="text-2xl mx-4 my-4">You could test the below API</p>

        <div className="mx-4 my-10">
          <KeyUi />
        </div>

        <ApiColumn
          title={clipsApiParams.title}
          param={clipsApiParams.param}
          resType={clipsApiParams.resType}
        />
        <ApiColumn
          title={categoryApiParams.title}
          param={categoryApiParams.param}
          resType={categoryApiParams.resType}
        />
      </div>
    </div>
  );
};
export default UserApiPage;