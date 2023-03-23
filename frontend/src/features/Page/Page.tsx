import { Session } from "@supabase/supabase-js";
import React from "react";
import { useAppSelector } from "../../app/hooks";
import { SwaggerApi } from "../api/SwaggerApi";
import { Chart } from "../chart/Chart";
import { ListingBar } from "../listingBar/ListBar";
import { TopBar } from "../topBar/TopBar";
import { selectPage } from "./pageSlice";

export const Page = ({ session }: { session: Session }) => {
  const globalSelect = useAppSelector(selectPage);
  const ChartPage = () => {
    return (
      <div className="flex ">
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

  const ApiPage = () => {
    return <SwaggerApi session={session} />;
  };

  function renderPage() {
    switch (globalSelect) {
      case "chartPage":
        return ChartPage();
      case "apiPage":
        return ApiPage();
    }
  }
  return <>{renderPage()}</>;
};
