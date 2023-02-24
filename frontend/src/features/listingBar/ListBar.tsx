import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { updateSymbol } from "../chart/chartSlice";

export interface Listing {
  listings: ListingInfo;
}
type ListingInfo = [
  {
    symbol: number;
    enName: string;
    zhNAme: string;
  }
];
export function ListingBar(listings: Listing) {
  const dispatch = useAppDispatch();

  return (
    <div className="listingBar">
      <select onChange={e=>dispatch(updateSymbol(e.target.value))} multiple className="h-full w-full">
        {listings.listings.map((x) => (
          <option key={x.symbol}>{x.symbol}</option>
        ))}
      </select>
    </div>
  );
}
