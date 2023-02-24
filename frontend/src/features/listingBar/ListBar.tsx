import React from "react";

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
  return (
    <div className="listingBar">
      <select multiple className="h-full w-full">
        {listings.listings.map((x) => (
          <option key={x.symbol}>{x.symbol}</option>
        ))}
      </select>
    </div>
  );
}
