import axios from "axios";
import React, { useMemo } from "react";
import { useQuery } from "react-query";
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
const fetchListings = () => axios.get("http://localhost:3000/listing");
export function ListingBar() {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useQuery("listings", fetchListings);
  
  const globalViewing = useAppSelector(selectViewing);
  const usListings = useMemo(
    () => data?.data.us.map((x) => <option key={x.symbol}>{x.symbol}</option>),
    [data]
  );
  const hkListings = data?.data.hk.map(
    (x) => <option key={x.symbol}>{x.symbol}</option>,
    [data]
  );
  //isloading must be placed under hook
  if(isLoading){
    return <span>loading</span>
  }
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
        {renderSwitch(globalViewing)}
      </select>
      <div className="flex">
        <button onClick={() => dispatch(updateViewing("hk"))}>hk</button>
        <button onClick={() => dispatch(updateViewing("us"))}>us</button>
      </div>
    </div>
  );
}
