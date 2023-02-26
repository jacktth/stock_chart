import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateSymbol } from "../chart/chartSlice";

export interface ListingProp {
  hk: [
    {
      symbol: number;
      enName: string;
      zhNAme: string;
    }
  ];
  us: [
    {
      symbol: number;
      enName: string;
    }
  ];
}
type ListingInfo = {
  hk: [
    {
      symbol: number;
      enName: string;
      zhNAme: string;
    }
  ];
  us: [
    {
      symbol: number;
      enName: string;
    }
  ];
};
export function ListingBar(listings: ListingProp) {
  const dispatch = useAppDispatch();
  const globalViewing = useAppSelector(selectViewing);

  const hkListings = listings.hk;
  const usListings = listings.us;
  // const renderSwitch = (globalViewing:string) => {
  //   switch (globalViewing) {
  //     case "hk":
  //       return hkListings.map((x) => (
  //         <option key={x.symbol}>{x.symbol}</option>

  //       ));
  //     case "us":
  //       return usListings.map((x) => (
  //         <option key={x.symbol}>{x.symbol}</option>
  //       ));
  //     default:
  //       return <option>Server Error</option>;
  //   }
  // };
  const renderSwitch = (globalViewing: string) => {
    switch (globalViewing) {
      case "hk":
        const option = hkListings.map((x) => (
          <option key={x.symbol}>{x.symbol}</option>
        ));
        return option;
      case "us":
        const option1 = usListings.map((x) => (
          <option key={x.symbol}>{x.symbol}</option>
        ));
        return option1;
      default:
        return <option>Server Error</option>;
    }
  };
  return (
    <div className="listingBar">
      <select
        onChange={(e) =>
          dispatch(
            updateSymbol(
              globalViewing === "hk" ? e.target.value + ".HK" : e.target.value+ ".US"
            )
          )
        }
        multiple
        className="h-full w-full"
      >
        {renderSwitch(globalViewing)}
      </select>
    </div>
  );
}
