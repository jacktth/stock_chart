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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateFocus, updateSymbol } from "../chart/chartSlice";
import AutoSizer from "react-virtualized-auto-sizer";
import { selectClip, selectCategories } from "./listSlice";
import { selectAuth } from "../auth/authSlice";
import { Session } from "@supabase/supabase-js";
import { symbolList } from "./symbolsList";
import { categoricalList } from "./userCategoricalList";

const fetchListings = () =>
  axios.get<ListingResponse>("http://localhost:3000/listing");

export function ListingBar(session: Session) {
  const { data, isLoading } = useQuery("listings", fetchListings, {});

  if (isLoading) <div>loading...</div>;

  return (
    <div className="listingBar">
      <>{categoricalList(session)}</>
      <>{symbolList(session, data)}</>
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
  
  status: number;
};
export type AllListings = {
  symbol: string;
  engName?: string;
  market: string;
  zhName?: string;

};
