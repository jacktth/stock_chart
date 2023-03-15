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
import { useQueryClient } from "react-query";
import { Database } from "../../api/types/supabase";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useUpdateUserClipMutation } from "../../hooks/useUpdateUserClipMutation";
import { selectAuth } from "../auth/authSlice";
import {
  selectMarket,
  selectSelectedData,
  selectSymbol,
} from "../chart/chartSlice";
import { defaultCategories } from "../listingBar/defaultCategories";
import { addClip, selectCategories } from "../listingBar/listSlice";

export type SelectedData = {
  starting: number | null;
  ending: number | null;
};

export function SaveBar(session: Session, dateArray: number[]) {
  const dispatch = useAppDispatch();
  const globalCategories = useAppSelector(selectCategories);
  const globalMarket = useAppSelector(selectMarket);
  const globalSymbol = useAppSelector(selectSymbol);
  const globalSelectedData = useAppSelector(selectSelectedData);
  const updateClipMutation = useUpdateUserClipMutation();
  const [selectCategory, setSelectCategory] = useState("");
  const { data, isLoading } = useCategoriesQuery(session.user.id);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data) {
      setSelectCategory(data[0].name);
      console.log("setSelectCategory");
    }
  }, [data]);
  if (isLoading) {
    return <span>Loading...</span>;
  }

  const options = (
    categories: Database["public"]["Tables"]["categories"]["Row"][]
  ) => {
    if (categories)
      return categories.map((el) => {
        if (defaultCategories().some((defaults) => el.name === defaults)) {
          return 
        } else {
          return (
            <option key={el.name} value={el.name}>
              {el.name}
            </option>
          );
        }
      });
  };
  function insertClip(e) {
    e.preventDefault();
    console.log(
      session.user.id,
      selectCategory,
      globalSymbol,
      globalSelectedData.ending,
      globalSelectedData.starting,
      globalMarket
    );

    if (
      session.user.id &&
      selectCategory &&
      globalSymbol &&
      globalSelectedData.ending !== 0 &&
      globalSelectedData.starting !== 0 &&
      globalMarket
    ) {
      console.log("updateClipMutation");

      updateClipMutation.mutate({
        selectedData: {
          starting: globalSelectedData.starting,
          ending: globalSelectedData.ending,
        },
        userId: session.user.id,
        category: selectCategory,
        symbol: globalSymbol,
        market: globalMarket,
      });
    } else if (
      globalSelectedData.ending == (null || 0) &&
      globalSelectedData.starting == (null || 0)
    ) {
      updateClipMutation.mutate({
        selectedData: {
          starting: null,
          ending: null,
        },
        userId: session.user.id,
        category: selectCategory,
        symbol: globalSymbol,
        market: globalMarket,
      });
      alert("Please select data after saving");
    } else {
      alert("State error");
    }
  }
  return (
    <form onSubmit={(e) => insertClip(e)}>
      <select
        onChange={(e) => {
          setSelectCategory(e.target.value);
        }}
      >
        {data ? options(data) : null}
      </select>
      <button>Save</button>
    </form>
  );
}
