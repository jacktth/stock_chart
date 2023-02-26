import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateSymbol, updateViewing } from "../chart/chartSlice";

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
  
  const renderSwitch = (globalViewing: string) => {
    switch (globalViewing) {
      case "hk":
        const hkOptions = hkListings.map((x) => (
          <option key={x.symbol}>{x.symbol}</option>
        ));
        return hkOptions;
      case "us":
        const usOptions = usListings.map((x) => (
          <option key={x.symbol}>{x.symbol}</option>
        ));
        return usOptions;
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
      <div className="flex">
        <button onClick={()=>dispatch(updateViewing('hk'))}>hk</button>
        <button onClick={()=>dispatch(updateViewing('us'))}>us</button>

      </div>
    </div>
  );
}
