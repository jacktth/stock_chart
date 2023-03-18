import { Session } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { FixedSizeList as List } from "react-window";
import { getUserCategoriesQuery } from "../../api/queries/getUserCategoriesQuery";
import { supabase } from "../../api/supabaseClient";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useDeleteUserCategoriesMutation } from "../../hooks/useDeleteUserCategoriesMutation";
import useSupabase from "../../hooks/useSupabase";
import { useUpdateUserCategoryMutation } from "../../hooks/useUpdateUserCategoyMutation";
import { useUserQuery } from "../../hooks/useUserQuery";
import { authState, selectAuth } from "../auth/authSlice";
import { selectViewing, updateViewing } from "../chart/chartSlice";
import { defaultCategories } from "./defaultCategories";
import { addCategories, initCategories, selectCategories } from "./listSlice";

export function categoricalList(session: Session) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [creating, setCreating] = useState(false);

  const dispatch = useAppDispatch();
  const globalViewing = useAppSelector(selectViewing);
  const inputCategoryRef = useRef<HTMLInputElement>(null);

  const { data } = useCategoriesQuery(session.user.id);
  const queryClient = useQueryClient();
  const deleteCategoriesQuery = useDeleteUserCategoriesMutation();
  const updateCategoryMutation = useUpdateUserCategoryMutation();
  function updateViewingCategory(name:string){
    dispatch(updateViewing(name));
    if(defaultCategories().includes(name)){
      queryClient.invalidateQueries("listings");
      console.log("invalidateQueries",name);
      
    }
  }
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
            queryClient.invalidateQueries({ queryKey: ["categories"] });
          },
        }
      );
    }
  }
  function deleteCategory(userId: string, categoryName: string) {
    if (window.confirm(`Are you sure to delete ${categoryName} category?`)) {
      deleteCategoriesQuery.mutate(
        { userId, categoryName },
        {
          onSuccess(data, variables, context) {
            if (categoryName === globalViewing) dispatch(updateViewing(""));
          },
        }
      );
    }
  }

  function inputBox() {
    return (
      <div className="flex items-start">
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
        <button
          onClick={() => {
            setCreating(false);
          }}
        >
          x
        </button>
      </div>
    );
  }

  const Row = ({ index, style }) => {
    if (data) {
      return (
        <div
          style={style}
          className={`hover:bg-sky-300 leading-3 border-2 border-solid  ${
            data[index].name === selectedCategory ? "bg-sky-200" : null
          } flex justify-between text-sm`}
          onClick={() => {
            updateViewingCategory(data[index].name)
            setSelectedCategory(data[index].name);
          }}
        >
          <button
            className={"w-11/12"}
          >
            {data[index].name}
          </button>
          <button
            className=""
            onClick={() => {
              deleteCategory(data[index].user_id, data[index].name);
            }}
          >
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
