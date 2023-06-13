import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useClipsQuery } from "../../hooks/useClipsQuery";
import { useQuery, useQueryClient } from "react-query";
import { Session } from "@supabase/supabase-js";
import axios from "axios";
import { ListingData } from "./types";
import { selectedCategory } from "./listSlice";
import { defaultCategories } from "./utilities";
import PublicSymbols from "./PublicSymbols";
import UsersSymbols from "./UsersSymbols";
import LoadingComponent from "../commonUI/LoadingComponent";

function SymbolsList({ session }: { session: Session }) {
  //This is a fn to separate PublicSymbols and UsersSymbols
  const globalSelectedCategory = useAppSelector(selectedCategory);

  function fetchListings(){
    return axios.get<ListingData[]>(`${import.meta.env.VITE_SERVER}listing`, {
      params: {
        market: globalSelectedCategory,
      },
    });}
  //globalSelectedCategory must be in the list of useQuery to refresh data
  const {
    data: listingResponse,
    isLoading: listingIsLoading,
    isSuccess: listingIsSuccess,
  } = useQuery(["listings", globalSelectedCategory], fetchListings, {});

  const { data: userSymbols, isLoading: userSymbolsLoading } = useClipsQuery(
    session.user.id
  );

  if (defaultCategories().includes(globalSelectedCategory)) {
    if (listingIsLoading) return <LoadingComponent/>;
    if (listingResponse && defaultCategories().includes(globalSelectedCategory))
      return (
        <PublicSymbols
          market={globalSelectedCategory}
          data={listingResponse.data}
        />
      );
  } else if (!defaultCategories().includes(globalSelectedCategory)) {
    if (userSymbolsLoading) return <LoadingComponent/>;
    if (userSymbols && userSymbols.data) {
      return <UsersSymbols selectedCategory={globalSelectedCategory} userSymbols={userSymbols.data} session={session}/>;
    }
  }

  return <></>;
}


export default SymbolsList