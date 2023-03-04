import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  selectViewing,
  updateSymbol,
  updateViewing,
} from "../chart/chartSlice";

export type ListingProp = {
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
  const usListings = useMemo(
    () => listings.us.map((x) => <option key={x.symbol}>{x.symbol}</option>),
    [listings]
  );
  const hkListings = listings.hk.map(
    (x) => <option key={x.symbol}>{x.symbol}</option>,
    [listings]
  );

  const renderSwitch = (globalViewing: string) => {
    switch (globalViewing) {
      case "hk":
        return hkListings;
      case "us":
        return usListings;
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
              globalViewing === "hk"
                ? e.target.value + ".HK"
                : e.target.value + ".US"
            )
          )
        }
        multiple
        className="h-full w-full"
      >
        {/* {children} */}
        {renderSwitch(globalViewing)}
      </select>
      <div className="flex">
        <button onClick={() => dispatch(updateViewing("hk"))}>hk</button>
        <button onClick={() => dispatch(updateViewing("us"))}>us</button>
      </div>
    </div>
  );
}
