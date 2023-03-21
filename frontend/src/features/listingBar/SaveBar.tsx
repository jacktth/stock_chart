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
import { defaultCategories } from "./defaultCategories";
import { addClip, selectCategories } from "./listSlice";

export type SelectedData = {
  starting: number | null;
  ending: number | null;
};

export function SaveBar({
  session,
}: {
  session: Session;
}) {
  const dispatch = useAppDispatch();
  const globalMarket = useAppSelector(selectMarket);
  const globalSymbol = useAppSelector(selectSymbol);
  const globalSelectedData = useAppSelector(selectSelectedData);
  const updateClipMutation = useUpdateUserClipMutation();
  const [selectCategory, setSelectCategory] = useState("123");
  const { data, isLoading } = useCategoriesQuery(session.user.id);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (data) {
      const container: Database["public"]["Tables"]["categories"]["Row"][] = [];
      data.map((cate) => {
        if (defaultCategories().some((defaults) => cate.name === defaults)) {
          return;
        } else {
          container.push(cate);
        }
      });
      setSelectCategory(container[0].name);
    }
  }, [data]);


  
  function insertClip(e) {
    e.preventDefault();
    console.log("selectCategory", selectCategory);

    if (
      session.user.id &&
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
    } else {
      alert("State error");
    }
  }

  if (isLoading) {
    return <span>Loading...</span>;
  } else {
    const options = (
      categories: Database["public"]["Tables"]["categories"]["Row"][]
    ) => {
      if (categories)
        return categories.map((el) => {
          if (defaultCategories().some((defaults) => el.name === defaults)) {
            return;
          } else {
            return (
              <option key={el.name} value={el.name} >
                {el.name}
              </option>
            );
          }
        });
    };
    
    return (
      <div className="border-dotted border-2 border-sky-500">
        <form className="flex justify-evenly" onSubmit={(e) => insertClip(e)}>
          <select
          value={selectCategory}
            onChange={(e) => {
              console.log(e.target.value);
              
              setSelectCategory(e.target.value);
            }}
          >
            {data ? options(data) : null}
          </select>
          <button className="rounded bg-sky-300">Save</button>
        </form>
      </div>
    );
  }
}
