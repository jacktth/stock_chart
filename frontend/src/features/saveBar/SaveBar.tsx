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
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useUpdateUserClipMutation } from "../../hooks/useUpdateUserClipMutation";
import { selectAuth } from "../auth/authSlice";
import { selectMarket, selectSelectedData, selectSymbol } from "../chart/chartSlice";
import { addClip, selectCategories } from "../listingBar/listSlice";

export type SelectedData = {
  starting: number ;
  ending: number ;
};

export function SaveBar() {
  const dispatch = useAppDispatch();

  const globalCategories = useAppSelector(selectCategories);
  const globalAuth = useAppSelector(selectAuth);
  const globalMarket = useAppSelector(selectMarket);
  const globalSymbol = useAppSelector(selectSymbol);
  const globalSelectedData = useAppSelector(selectSelectedData);
  const updateClipMutation = useUpdateUserClipMutation();
  const [selectCategory, setSelectCategory] = useState("");
  useEffect(() => {
    setSelectCategory(globalCategories[0])
    
  }, [globalCategories])
  
  const options = (categories: string[]) => {
    return categories.map((el) => {
      return <option key={el} value={el}>{el}</option>;
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

        onSelect={(e) => setSelectCategory(e.currentTarget.value)}
      >
        {options(globalCategories)}
      </select>
      <button>Save</button>
    </form>
  );
}
