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



export function ListingBar(session: Session) {


  return (
    <div className="listingBar">
      <>{categoricalList(session)}</>
      <>{symbolList(session)}</>
    </div>
  );
}


export type AllListings = {
  symbol: string;
  engName?: string;
  market: string;
  zhName?: string;

};
