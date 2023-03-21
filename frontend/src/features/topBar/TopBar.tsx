import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { supabase } from "../../api/supabaseClient";
import axios from "axios";
import dataSorting from "../chart/dataSorting";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSymbol, updateSymbol } from "../chart/chartSlice";
import { Session } from "@supabase/supabase-js";

export const TopBar = ({ session }: { session: Session }) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<any>("no error");
  const [symbolInput, setSymbolInput] = useState<string>("");
  const globalSymbol = useAppSelector(selectSymbol);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const handleSubmit = (e) => {
    // axios
    //   .post("http://localhost:3000/stock-data", {
    //     symbol: globalSymbol,
    //     period1: "2022-02-01",
    //   })
    //   .then(
    //     ({ data, status }) => {
    //       setError(status);
    //       const sortedData = dataSorting(data);
    //       setDateArray(sortedData.date);
    //     },
    //     (error) => {
    //       setError(error);
    //     }
    //   );
    e.preventDefault();
  };

  function symbolOnChange(e) {
    dispatch(updateSymbol(e.target.value));
    e.preventDefault();
  }
  return (
    <>
      <div style={{ height: "7vh" }} className="flex justify-between relative">
        <div>
          <form className=" h-full " onSubmit={handleSubmit}>
            <label>
              <input
                className="input text-center"
                type="text"
                name="name"
                placeholder="Symbol"
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value)}
              />
            </label>
          </form>
        </div>

        <div className="flex flex-col  w-1/12  ">
          <button className="">
            <AccountCircleIcon />
          </button>
          <button className="text-xs" onClick={signOut}>
            <span>log out</span>{" "}
          </button>
        </div>
      </div>
    </>
  );
};
