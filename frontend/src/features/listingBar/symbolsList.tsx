import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useClipsQuery } from "../../hooks/useClipsQuery";
import { useQuery, useQueryClient } from "react-query";
import { defaultCategories } from "./defaultCategories";
import { Session } from "@supabase/supabase-js";
import axios from "axios";
import { PublicSymbols } from "./PublicSymbols";
import { ListingData } from "./types";
import { UserSymbols } from "./UserSymbols";
import { selectedCategory } from "./listSlice";

export function SymbolList({ session }: { session: Session }) {
  // UsHkData: AxiosResponse<ListingResponse, any> | undefined
  const dispatch = useAppDispatch();
  const globalSelectedCategory = useAppSelector(selectedCategory);
  const queryClient = useQueryClient();

  const fetchListings = () =>
    axios.get<ListingData[]>("http://localhost:3000/listing", {
      params: {
        market: globalSelectedCategory,
      },
    });

  //globalSelectedCategory must be in the list of useQuery
  const {
    data: listingResponse,
    isLoading: listingIsLoading,
    isSuccess: listingIsSuccess,
  } = useQuery(["listings", globalSelectedCategory], fetchListings, {});

  const { data: userSymbols, isLoading: userSymbolsLoading } = useClipsQuery(
    session.user.id
  );

  if (defaultCategories().includes(globalSelectedCategory)) {
    if (listingIsLoading) return <>loading...</>;
    if (listingResponse && defaultCategories().includes(globalSelectedCategory))
      return (
        <PublicSymbols
          market={globalSelectedCategory}
          data={listingResponse.data}
        />
      );
  } else if (!defaultCategories().includes(globalSelectedCategory)) {
    if (userSymbolsLoading) return <>loading...</>;
    if (userSymbols && userSymbols.data) {
      return <UserSymbols userSymbols={userSymbols.data} session={session}/>;
    }
  }

  return <></>;
}
