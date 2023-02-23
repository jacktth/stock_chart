import React from "react";

export interface Listing{
    listings: ListingInfo
}
type ListingInfo = [{
    symbol:number,
    engName:string
    zhNAme:string
}]
export function ListingBar(listings:Listing){
    
    return (
        <select multiple>{
            listings.listings.map( (x) => 
              <option key={x.symbol}>{x.symbol}</option> )
          }</select>
    )
}