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
  updateSelectedData,
} from "../chart/chartSlice";
import { defaultCategories } from "./defaultCategories";
import {
  addClip,
  selectCategories,
  selectedUserCategoryInfo,
  updateUserCategoryInfo,
} from "./listSlice";
import { log } from "console";

export type SelectedData = {
  starting: number | null;
  ending: number | null;
};

export function SaveBar({ session }: { session: Session }) {
  const dispatch = useAppDispatch();
  const globalMarket = useAppSelector(selectMarket);
  const globalSymbol = useAppSelector(selectSymbol);
  const globalSelectedCategoryInfo = useAppSelector(selectedUserCategoryInfo);

  const globalSelectedData = useAppSelector(selectSelectedData);
  const updateClipMutation = useUpdateUserClipMutation();
  const [selectCategoryId, setSelectCategoryId] = useState<number>();
  const [selectCategory, setSelectCategory] = useState("");
  const { data, isLoading } = useCategoriesQuery(session.user.id);
  const queryClient = useQueryClient();
  useEffect(() => {
    console.log("effect");
    
    if (data ) {
      const container: Database["public"]["Tables"]["categories"]["Row"][] = [];
      data.map((cate) => {
        if (defaultCategories().some((defaults) => cate.name === defaults)) {
          return;
        } else {
          container.push(cate);
        }
      });

      let exist = false;
      container.forEach((cate) => {
        if (cate.name === selectCategory) {
          exist = true;
          console.log(cate.name," ",selectCategory)
        }
      });
      if (exist === false) {
        console.log("false exist");

        setSelectCategory(container[0].name);
        setSelectCategoryId(container[0].id);
      } else {
        return;
      }
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
      globalMarket &&
      selectCategoryId
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
        category_id: selectCategoryId,
      });
    } else if (
      globalSelectedData.ending == (null || 0) &&
      globalSelectedData.starting == (null || 0) &&
      selectCategoryId
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
        category_id: selectCategoryId,
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
              <option key={el.id} value={el.id} label={el.name}>
                {el.name}
              </option>
            );
          }
        });
    };

    return (
      <div className=" border-2 border-sky-500">
        <form className="flex justify-evenly" onSubmit={(e) => insertClip(e)}>
          <select
          className="text-sm w-full"
            onChange={(e) => {
              const categoryId =
                e.target.options[e.target.options.selectedIndex].value;
              const categoryName =
                e.target.options[e.target.options.selectedIndex].label;
              console.log("name", categoryName, " ", "id", categoryId);
              setSelectCategoryId(Number(categoryId));
              setSelectCategory(categoryName);
            }}
          >
            {data ? options(data) : null}
          </select>
          <button
            className="button"
            title="Save the selected range of stock data"
          >
            Save
          </button>
        </form>
      </div>
    );
  }
}
