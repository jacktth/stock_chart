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
import { ApiColumn } from "./ApiColumn";

export const SwaggerApi = ({ session }: { session: Session }) => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const client = useSupabase();
  const { data, error, isLoading } = useApiKeyQuery(session.user.id);

  async function updateApiKey() {
    console.log("sssss", session.user.id);

    const { data: res } = await client.rpc("update_user_api_key");

    queryClient.invalidateQueries({ queryKey: ["apiKey"] });
  }

  function copyToClipboard() {
    if (data) return navigator.clipboard.writeText(data[0].api_key);
  }

  const KeyUi = () => {
    if (isLoading) return <>loading...</>;
    if (data) {
      return (
        <div
          className="leading-normal "
          style={{
            padding: "0 20px",
            margin: "auto",
            maxWidth: "1460px",
            marginTop: "20px",
          }}
        >
          <p className="text-3xl text-stone-900 pb-2">Your Api Key</p>
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
            <button className="button" onClick={() => updateApiKey()}>
              Generate new Api key
            </button>
          </div>
        </div>
      );
    } else {
      return <>Server error, please contact the admin</>;
    }
  };

  const SwaggerApiUi = () => {
    // if (error) return <>Server error, please contact the admin</>;
  };

  return (
    <>
      <button onClick={() => dispatch(changePage("chartPage"))}>
        Back to chart
      </button>
      <div className="text-stone-900">
        <KeyUi />

        <SwaggerUI url="http://localhost:3000/api-json" />
        <ApiColumn
          title={{ queryRoute: "/user-data/clips", method: "GET" }}
          param={[
            {
              param: "apiKey",
              type: "string",
              isRequired: true,
              placeholder: "Your apiKey",
              description: "test",
              example: "test",
            },
            {
              param: "categories",
              type: "array[string]",
              isRequired: true,
              placeholder: "Your categories",
              description: "test",
              example:
                "Example record; [Example record,Example record 1,Example record 2]",
            },
          ]
        }
        resType={{code:200,description:`symbol: string;
        category:string;
        date:{from:string,to:string};
        data:{date: Date,
          open: number,
          high: number,
          low: number,
          close: number,
          adjClose?: number,
          volume: number}[];
        `}}
        />
      </div>
    </>
  );
};
