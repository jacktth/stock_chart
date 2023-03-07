import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { FixedSizeList as List } from "react-window";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useUpdateCategoryMutation } from "../../hooks/useUpdateCategoyMutation";
import { authState, selectAuth } from "../auth/authSlice";
import { updateViewing } from "../chart/chartSlice";
import { addCategories, initCategories, selectCategories } from "./listSlice";

export function categoricalList() {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [creating, setCreating] = useState(false);
  const globalCategories = useAppSelector(selectCategories);
  const globalAuth = useAppSelector(selectAuth);
  const inputCategoryRef = useRef<HTMLInputElement>(null);
  const updateCategoryMutation = useUpdateCategoryMutation();

  function insertCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (inputCategoryRef.current?.value && globalAuth.id) {
      updateCategoryMutation.mutate(
        {
          name: inputCategoryRef.current?.value,
          userId: globalAuth.id,
        },
        {
          onSuccess(data, variables, context) {
            dispatch(addCategories(variables.name));
          },
        }
      );
    }
  }

  function inputBox() {
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
  const Row = ({ index, style }) => (
    <div>
      <button
        style={style}
        className={`hover:bg-sky-300 leading-3 border-2 border-solid p-2 ${
          globalCategories[index] === selectedCategory ? "bg-sky-200" : null
        } flex justify-between text-sm`}
        onClick={() => {
          dispatch(updateViewing(globalCategories[index]));
          setSelectedCategory(globalCategories[index]);
        }}
      >
        <span>{globalCategories[index]}</span>

        <img
          className="h-4"
          src="https://img.icons8.com/material-rounded/256/delete-trash.png"
          alt=""
        />
      </button>
    </div>
  );
  return (
    <>
      <div className="flex">
        <span className="text-center">Categories</span>
        <button title="Add new Categories " onClick={() => setCreating(true)}>
          +
        </button>
      </div>
      <>{creating ? inputBox() : null}</>

      <List
        className=""
        height={100}
        width={"100%"}
        itemSize={30}
        itemCount={globalCategories.length}
        overscanCount={10}
      >
        {Row}
      </List>
    </>
  );
}
