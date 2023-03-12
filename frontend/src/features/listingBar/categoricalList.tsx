import { Session } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FixedSizeList as List } from "react-window";
import { getUserCategoriesQuery } from "../../api/queries/getUserCategoriesQuery";
import { supabase } from "../../api/supabaseClient";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import useSupabase from "../../hooks/useSupabase";
import { useUpdateUserCategoryMutation } from "../../hooks/useUpdateUserCategoyMutation";
import { useUserQuery } from "../../hooks/useUserQuery";
import { authState, selectAuth } from "../auth/authSlice";
import { updateViewing } from "../chart/chartSlice";
import { addCategories, initCategories, selectCategories } from "./listSlice";

export function categoricalList(session: Session) {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [creating, setCreating] = useState(false);
  const globalCategories = useAppSelector(selectCategories);
  const inputCategoryRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const updateCategoryMutation = useUpdateUserCategoryMutation();
  const { data } = useCategoriesQuery(session.user.id);
  function inputBox() {
    function insertCategory(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();

      if (inputCategoryRef.current?.value && session.user.id) {
        updateCategoryMutation.mutate(
          {
            name: inputCategoryRef.current?.value,
            userId: session.user.id,
          },
          {
            onSuccess(data, variables, context) {
              // dispatch(addCategories(variables.name));
              queryClient.invalidateQueries({ queryKey: ["categories"] });
            },
          }
        );
      }
    }
    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCreating(false);
            insertCategory(e);
          }}
        >
          <input
            ref={inputCategoryRef}
            className="input"
            placeholder="New category name"
            type="text"
          />
        </form>
      </div>
    );
  }

  const Row = ({ index, style }) => {
    if (data) {
      return (
        <div
          className={`hover:bg-sky-300 leading-3 border-2 border-solid p-2 ${
            data[index].name === selectedCategory ? "bg-sky-200" : null
          } flex justify-between text-sm`}
          onClick={() => {
            dispatch(updateViewing(data[index].name));
            setSelectedCategory(data[index].name);
          }}
        >
          <button
            // style={style}
            className={``}
            
          >
            {data[index].name}
          </button>
          <button className=""  onClick={() => alert("s")}>
            <img
              className="h-4"
              src="https://img.icons8.com/material-rounded/256/delete-trash.png"
              alt=""
            />
          </button>
        </div>
      );
    } else {
      return null;
    }
  };
  return (
    <>
      <div className="flex">
        <span className="text-center">Categories</span>
        <button title="Add new Categories " onClick={() => setCreating(true)}>
          +
        </button>
      </div>
      <>{creating ? inputBox() : null}</>

      {data ? (
        <List
          className=""
          height={100}
          width={"100%"}
          itemSize={30}
          itemCount={data.length}
          overscanCount={10}
        >
          {Row}
        </List>
      ) : null}
    </>
  );
}
