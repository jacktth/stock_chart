import {
  Autocomplete,
  Box,
  createFilterOptions,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { FixedSizeList as List } from "react-window";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateSymbol } from "../chart/chartSlice";
import AutoSizer from "react-virtualized-auto-sizer";
import { categoricalList } from "./categoricalList";
import { selectClip, selectCategories } from "./listSlice";

const fetchListings = () =>
  axios.get<ListingResponse>("http://localhost:3000/listing");

export function ListingBar() {
  const dispatch = useAppDispatch();
  const globalClip = useAppSelector(selectClip);
  const globalCategories = useAppSelector(selectCategories);
  const globalViewing = useAppSelector(selectViewing);
  const { data, isLoading } = useQuery("listings", fetchListings, {
    onSuccess(data) {
      const container: AllListings[] = [];
      data.data.hk.forEach((el) => container.push({ ...el, label: "HK" }));
      data.data.us.forEach((el) => container.push({ ...el, label: "US" }));
    },
  });
  function symbolList(
    globalViewing: string,
    data: AxiosResponse<ListingResponse, any> | undefined
  ) {
    if (data) {
      const container: AllListings[] = [];
      switch (globalViewing) {
        case "hk":
          data.data.hk.forEach((el) => container.push({ ...el, label: "HK" }));

          break;
        case "us":
          data.data.us.forEach((el) => container.push({ ...el, label: "US" }));

          break;
        default:
          break;
      }
      const Row = ({ index, style }) => (
        <div
          style={style}
          className="hover:bg-sky-300 leading-3 border-2 border-solid p-2"
          onClick={() =>
            dispatch(
              updateSymbol(
                globalViewing === "hk"
                  ? container[index].symbol + ".HK"
                  : container[index].symbol + ".US"
              )
            )
          }
        >
          <span>{container[index].symbol}</span>
          <br />
          <span className="text-xs ">{container[index].engName}</span>
        </div>
      );
      return (
        <>
          <div className="flex text-sm">
            <img
              src={`https://flagcdn.com/${globalViewing.toLocaleLowerCase()}.svg`}
              width="20%"
              height="20%"
            />
            <span>{globalViewing.toLocaleUpperCase()} Market</span>
          </div>
          <List
            className=""
            height={300}
            width={"100%"}
            itemSize={70}
            itemCount={container.length}
            overscanCount={10}
          >
            {Row}
          </List>
        </>
      );
    }
  }

  if (isLoading) <div>loading...</div>;

  return (
    <div className="listingBar">
      <>{categoricalList()}</>
      <>{symbolList(globalViewing, data)}</>
    </div>
  );
}
export type ListingResponse = {
  hk: [
    {
      symbol: string;
      engName: string;
      zhNAme: string;
    }
  ];
  us: [
    {
      symbol: string;
      engName: string;
    }
  ];
};
export type AllListings = {
  symbol: string;
  engName: string;
  label: string;
  zhNAme?: string;
};
