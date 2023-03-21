import { Session } from "@supabase/supabase-js";
import React from "react";
import { Chart } from "../chart/Chart";
import { ListingBar } from "../listingBar/ListBar";
import { TopBar } from "../topBar/TopBar";

export const Page = ({ session }: { session: Session }) => {
  return (
    <>
      <div className="flex ">
      <div className="w-2/12 ">
          <ListingBar session={session} />
        </div>
        <div style={{height:"100vh"}} className="w-10/12 ">
          <TopBar session={session} />
          <Chart/>
        </div>
       
      </div>
    </>
  );
};
