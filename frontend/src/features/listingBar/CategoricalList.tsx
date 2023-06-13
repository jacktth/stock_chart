import { Session } from "@supabase/supabase-js";
import React, { useRef, useState } from "react";
import { useQueryClient } from "react-query";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useDeleteUserCategoriesMutation } from "../../hooks/useDeleteUserCategoriesMutation";
import { useUpdateUserCategoryMutation } from "../../hooks/useUpdateUserCategoyMutation";
import { selectViewing, updateViewing } from "../chart/chartSlice";
import { changeCategory } from "./listSlice";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useVirtualizer } from "@tanstack/react-virtual";
import { CategoriesQueryData } from "./types";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import { defaultCategories } from "./utilities";
//This the component for the categories which is "Your categories"
function CategoricalList({ session }: { session: Session }) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [creating, setCreating] = useState(false);
  const inputCategoryRef = useRef<HTMLInputElement>(null);

  //redux hooks
  const dispatch = useAppDispatch();
  const globalViewing = useAppSelector(selectViewing);

  //Custom hooks
  const { data } = useCategoriesQuery(session.user.id);
  const deleteCategoriesQuery = useDeleteUserCategoriesMutation();
  const updateCategoryMutation = useUpdateUserCategoryMutation();

  function updateSelectedCategory(name: string) {
    dispatch(changeCategory(name));
  }
  function createCategory(e: React.FormEvent<HTMLFormElement>) {
    //this fn is to create user's custom category
    e.preventDefault();

    if (inputCategoryRef.current?.value && session.user.id) {
      updateCategoryMutation.mutate({
        name: inputCategoryRef.current?.value,
        userId: session.user.id,
        default: false,
      });
    }

    if (!inputCategoryRef.current?.value) {
      alert("Empty name is not accept");
    }
  }
  function deleteCategory(userId: string, categoryName: string) {
    //this fn is to delete user's custom category
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
    //the element for the input box to input name of the custom category
    return (
      <div className=" ">
        <form
          className="flex w-full "
          onSubmit={(e) => {
            e.preventDefault();
            setCreating(false);
            createCategory(e);
          }}
        >
          <input
            ref={inputCategoryRef}
            className="   text-center w-full text-sm"
            placeholder="New category name"
            type="text"
          />
          <button className="text-sm button  " type="submit">
            <p className="text-center ">Add</p>
          </button>
        </form>
      </div>
    );
  };

  const CategoriesList = ({ data }: { data: CategoriesQueryData[] }) => {
    //the component for displaying all the categories
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
        <div className="w-full text-center">
          {creating ? inputBox() : <span>Your categories</span>}
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

      {data ? <CategoriesList data={data} /> : null}
    </>
  );
}

export default CategoricalList;
