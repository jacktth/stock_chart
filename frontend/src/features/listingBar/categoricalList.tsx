import React, { useState } from "react";
import { FixedSizeList as List } from "react-window";
import { useAppDispatch } from "../../app/hooks";
import { updateViewing } from "../chart/chartSlice";

export function categoricalList() {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [creating, setCreating] = useState(false);
  const categories = ["hk", "us"];

  function inputBox() {
    return (
      <div >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCreating(false);
          }}
        >
          <input
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
          categories[index] === selectedCategory ? "bg-sky-200" : null
        } flex justify-between`}
        onClick={() => {
          dispatch(updateViewing(categories[index]));
          setSelectedCategory(categories[index]);
        }}
      >
        <span>{categories[index]}</span>
        
        <img className="h-4" src="https://img.icons8.com/material-rounded/256/delete-trash.png" alt="" />

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
        itemCount={categories.length}
        overscanCount={10}
      >
        {Row}
      </List>
    </>
  );
}
