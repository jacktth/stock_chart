import { Session } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { FixedSizeList as List } from "react-window";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useDeleteUserCategoriesMutation } from "../../hooks/useDeleteUserCategoriesMutation";
import { useUpdateUserCategoryMutation } from "../../hooks/useUpdateUserCategoyMutation";
import { selectViewing, updateViewing } from "../chart/chartSlice";
import { defaultCategories } from "./defaultCategories";
import { changeCategory } from "./listSlice";

export function CategoricalList({ session }: { session: Session }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [creating, setCreating] = useState(false);
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();
  const globalViewing = useAppSelector(selectViewing);
  const inputCategoryRef = useRef<HTMLInputElement>(null);

  const { data } = useCategoriesQuery(session.user.id);
  const deleteCategoriesQuery = useDeleteUserCategoriesMutation();
  const updateCategoryMutation = useUpdateUserCategoryMutation();
  function updateSelectedCategory(name: string) {
    dispatch(changeCategory(name));
    //listings must be invalidated to update symbol data
    if (defaultCategories().includes(name)) {
      queryClient.invalidateQueries("listings");
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
            updateSelectedCategory(data[index].name);
            setSelectedCategory(data[index].name);
          }}
        >
          <button className={"w-11/12"}>{data[index].name}</button>
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
