import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import { Session } from "@supabase/supabase-js";
import React, { useEffect, useState } from "react";
import { Database } from "../../api/types/supabase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useUpdateUserClipMutation } from "../../hooks/useUpdateUserClipMutation";
import { selectAuth } from "../auth/authSlice";
import { selectMarket, selectSelectedData, selectSymbol } from "../chart/chartSlice";
import { addClip, selectCategories } from "../listingBar/listSlice";

export type SelectedData = {
  starting: number ;
  ending: number ;
};

export function SaveBar(session:Session) {
  const dispatch = useAppDispatch();
  const globalCategories = useAppSelector(selectCategories);
  const globalAuth = useAppSelector(selectAuth);
  const globalMarket = useAppSelector(selectMarket);
  const globalSymbol = useAppSelector(selectSymbol);
  const globalSelectedData = useAppSelector(selectSelectedData);
  const updateClipMutation = useUpdateUserClipMutation();
  const [selectCategory, setSelectCategory] = useState("");
  const {data,isLoading} = useCategoriesQuery(session.user.id);

  useEffect(() => {
    setSelectCategory(globalCategories[0])
    
  }, [globalCategories])
  if(isLoading){
    return <span>Loading...</span>
  }
 
  const options = (categories:Database['public']['Tables']['categories']['Row'][]) => {
     if(categories) return categories.map((el) => {
      return <option key={el.name} value={el.name}>{el.name}</option>;
    });
  };
  function insertClip(e) {
    e.preventDefault();
    console.log(globalAuth.id ,
      selectCategory ,
      globalSymbol ,
      globalSelectedData.ending ,
      globalSelectedData.starting ,
      globalMarket);
    
    if (
      globalAuth.id &&
      selectCategory &&
      globalSymbol &&
      globalSelectedData.ending !== 0 &&
      globalSelectedData.starting !== 0 && 
      globalMarket
      
    ) {
      updateClipMutation.mutate({
        selectedData: {
          starting: globalSelectedData.starting,
          ending: globalSelectedData.ending,
        },
        userId: globalAuth.id,
        category: selectCategory,
        symbol: globalSymbol,
        market:globalMarket
      },{onSuccess(data, variables, context) {
        dispatch(addClip({ symbol: variables.symbol,
          starting: variables.selectedData.starting,
          ending: variables.selectedData.ending,
          market: variables.market,
          category: variables.category}))
      },});
    } else if( globalSelectedData.ending == (null||0) &&
    globalSelectedData.starting == (null||0)){
      alert("Please select data after saving")
    } else {
      alert("State error")
    }
    
  }
  return (
    <form onSubmit={(e) => insertClip(e)}>
      <select

        onChange={(e) => {setSelectCategory(e.target.value)
        }}
      >
        {data ?options(data) :null}
      </select>
      <button>Save</button>
    </form>
  );
}
