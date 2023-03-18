import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateFocus, updateSymbol } from "../chart/chartSlice";
import { FixedSizeList as List } from "react-window";
import { useClipsQuery } from "../../hooks/useClipsQuery";
import { useQuery, useQueryClient } from "react-query";
import { defaultCategories } from "./defaultCategories";
import { Session } from "@supabase/supabase-js";
import { useDeleteUserClipMutation } from "../../hooks/UseDeleteUserClipMutation";

import { Clip } from "../../api/queries/getUserClipQuery";
import axios, { AxiosResponse } from "axios";

import { PublicSymbols } from "./PublicSymbols";
import { ListingData } from "./types";
import { UserSymbols } from "./UserSymbols";



export function symbolList(
  session: Session
  // UsHkData: AxiosResponse<ListingResponse, any> | undefined
) {
  const dispatch = useAppDispatch();
  const fetchListings = () =>
  axios.get<ListingData[]>("http://localhost:3000/listing", {
    params: {
      "market": globalViewing,
    },headers:{
      "Content-Type":"application/json; charset=utf-8"
    }
  });
  const globalViewing = useAppSelector(selectViewing);
  const {
    data: listingResponse,
    isLoading: listingIsLoading,
    isSuccess: listingIsSuccess,
  } = useQuery(["listings",globalViewing],  fetchListings, {
    onSuccess(data) {
      console.log("HKUS","dd",globalViewing);
      
    },
  });
  const { data: userSymbols, isLoading: userSymbolsLoading } = useClipsQuery(
    session.user.id
  );
  const queryClient = useQueryClient();
  const [selectedSymbolId, setSelectedSymbolId] = useState<number>();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  if (listingIsLoading) return <>loading...</>;
  if (listingResponse && defaultCategories().includes(globalViewing))
    return (
      <PublicSymbols market={globalViewing} data={listingResponse.data} />
    );
  if (userSymbolsLoading) return <>loading...</>;
  if (userSymbols && userSymbols.data)
    return <UserSymbols userSymbols={userSymbols.data} />;
}
