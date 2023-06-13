import { Session } from "@supabase/supabase-js";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { Chart } from "../chart/Chart";
import { TopBar } from "../topBar/TopBar";
import { selectPage } from "./pageSlice";
import { ApiPage } from "../api/ApiPage";
import { selectTopBar } from "../topBar/topBarSlice";
import { Tutorial } from "../topBar/Tutorial";
import { ListingBar } from "../listingBar/ListingBar";

export const Page = ({ session }: { session: Session }) => {
  const globalSelect = useAppSelector(selectPage);
  const globalTutorial = useAppSelector(selectTopBar);

  const ChartPage = () => {
    return (
      <div className="flex ">
        {globalTutorial.startTutorial===true ?<Tutorial/> :null}

        <div className="w-2/12 ">
          <ListingBar session={session} />
        </div>
        <div style={{ height: "100vh" }} className="w-10/12 ">

          <TopBar session={session} />
          <Chart />
        </div>
      </div>
    );
  };

 

  function renderPage() {
    switch (globalSelect) {
      case "chartPage":
        return ChartPage();
      case "apiPage":
        return <ApiPage session={session} />
    }
  }
  return <>{renderPage()}</>;
};
