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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CategoriesQueryData } from "./types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
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
  }
  function insertCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (inputCategoryRef.current?.value && session.user.id) {
      updateCategoryMutation.mutate(
        {
          name: inputCategoryRef.current?.value,
          userId: session.user.id,
          default: false,
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

  const inputBox = () => {
    return (
      <div className="flex justify-center w-12/12 items-center">
        <form
          className="flex w-full justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            setCreating(false);
            insertCategory(e);
          }}
        >
          <input
            ref={inputCategoryRef}
            className=" justify-self-center self-center text-center w-3/4"
            placeholder="New category name"
            type="text"
          />
          <button className="text-sm button w-1/6 " type="submit">
            <p className="text-center text-xs">Add</p>
          </button>
        </form>
      </div>
    );
  };

  const CategoriesList = ({ data }: { data: CategoriesQueryData[] }) => {
    const parentRef = React.useRef(null);

    // The virtualizer
    const rowVirtualizer = useVirtualizer({
      count: data.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 20,
      overscan: 15,
    });

    return (
      <>
        <div
          ref={parentRef}
          style={{
            height: `25vh`,
            width: `100%`,
            overflow: "auto",
          }}
        >
          <div
            style={{
              position: "relative",
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <div
                key={virtualRow.index}
                className={`hover:bg-sky-300 leading-3 border-2 border-solid  ${
                  data[virtualRow.index].name === selectedCategory
                    ? "bg-sky-200"
                    : null
                } flex justify-between text-sm`}
                onClick={() => {
                  updateSelectedCategory(data[virtualRow.index].name);
                  setSelectedCategory(data[virtualRow.index].name);
                }}
              >
                <button className={"w-11/12 h-5"}>
                  {data[virtualRow.index].name}
                </button>
                {!defaultCategories().includes(data[virtualRow.index].name) ? (
                  <button
                    className=""
                    onClick={() => {
                      deleteCategory(
                        data[virtualRow.index].user_id,
                        data[virtualRow.index].name
                      );
                    }}
                  >
                    <DeleteOutlineIcon />
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="w-full flex justify-between border-2 border-sky-500">
        <div></div>
        <div>
          <span>Your categories</span>
        </div>

        <div className="">
          {" "}
          <button
            className=" leading-5  justify-self-end"
            title="Add new Categories"
            onClick={() => setCreating(creating ? false : true)}
          >
            {creating ? <RemoveIcon /> : <AddCircleOutlineIcon />}
          </button>
        </div>
      </div>
      {creating ? inputBox() : null}

      {data ? <CategoriesList data={data} /> : null}
    </>
  );
}
