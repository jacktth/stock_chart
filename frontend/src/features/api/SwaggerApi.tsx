import { Session } from "@supabase/supabase-js";
import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useAppDispatch } from "../../app/hooks";
import { changePage } from "../Page/pageSlice";

export const SwaggerApi = ({ session }: { session: Session }) => {
  const dispatch = useAppDispatch();

  return (
    <div>
      <button onClick={() => dispatch(changePage("chartPage"))}>
        Back to your chart
      </button>
      <SwaggerUI url="http://localhost:3000/api-json" />
    </div>
  );
};
