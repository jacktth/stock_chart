import { Session } from "@supabase/supabase-js";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectPage } from "./pageSlice";
import { selectTopBar } from "../topBar/topBarSlice";
import TutorialWindow from "../topBar/TutorialWindow";
import ListingBar from "../listingBar/ListingBar";
import Chart from "../chart/Chart";
import UserApiPage from "../api/userApiPage";
import TopToolBar from "../topBar/topToolBar";

const Page = ({ session }: { session: Session }) => {
  const globalSelect = useAppSelector(selectPage);
  const globalTutorial = useAppSelector(selectTopBar);

  const ChartPage = () => {
    //This is the main chart page combined different components
    return (
      <div className="flex ">
        {globalTutorial.startTutorial === true ? <TutorialWindow /> : null}

        <div className="w-2/12 ">
          <ListingBar session={session} />
        </div>
        <div style={{ height: "100vh" }} className="w-10/12 ">
          <TopToolBar session={session} />

          <Chart />
        </div>
      </div>
    );
  };

  const  RenderPage=()=> {
    switch (globalSelect) {
      case "chartPage":
        return <ChartPage/>;
      case "apiPage":
        return <UserApiPage session={session} />;
    }
  }
  return <RenderPage/>;
};

export default Page;
