import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { supabase } from "../../api/supabaseClient";
import axios, { AxiosResponse } from "axios";
import dataSorting from "../chart/dataSorting";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSymbol, updateFocus, updateSymbol } from "../chart/chartSlice";
import { Session } from "@supabase/supabase-js";
import { changePage } from "../Page/pageSlice";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useQuery, useQueryClient } from "react-query";
import { selectedCategory } from "../listingBar/listSlice";
import { ListingData } from "../listingBar/types";
import { AllListings } from "../listingBar/ListBar";
import Fuse from "fuse.js";
import { log } from "console";

export const TopBar = ({ session }: { session: Session }) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<any>("no error");
  const [searching, setSearching] = useState(false);
  const globalSymbol = useAppSelector(selectSymbol);

  const [symbolInput, setSymbolInput] = useState<string>(globalSymbol);
  const parentRef = React.useRef(null);
  const queryClient = useQueryClient();
  const globalSelectedCategory = useAppSelector(selectedCategory);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };
useEffect(() => {
  setSearching(false)

  setSymbolInput(globalSymbol)
  
}, [globalSymbol])

  function clickPublicSymbol(container: AllListings) {
    dispatch(updateSymbol(container.symbol + "." + container.market));

    dispatch(
      updateFocus({
        min: null,
        max: null,
      })
    );
  }
  const handleSubmit = (e) => {

    e.preventDefault();
  };

  function symbolOnChange(e) {
    dispatch(updateSymbol(e.target.value));
    e.preventDefault();
  }

  function clickSuggestion(symbol: Fuse.FuseResult<ListingData>) {
    setSearching(false);
    setSelectedSymbol(symbol.item.symbol);
    if(symbol.item.market === "HK"){
      
    }
    dispatch(updateSymbol(symbol.item.symbol + "." + symbol.item.market));
    console.log(symbol.item.symbol + "." + symbol.item.market)
    setSymbolInput(symbol.item.symbol);
    dispatch(
      updateFocus({
        min: null,
        max: null,
      })
    );
  }
  const fetchListings = () =>
    axios.get<ListingData[]>("http://localhost:3000/allListings");

  //globalSelectedCategory must be in the list of useQuery to refresh data
  const {
    data: listingResponse,
    isLoading: listingIsLoading,
    isSuccess: listingIsSuccess,
  } = useQuery([], fetchListings, {});
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  const Suggestions = () => {
    if (listingResponse && symbolInput.length > 0 && searching===true ) {
      const symbols = listingResponse.data;
      const fuse = new Fuse(symbols, {
        keys: ["symbol"],
      });
      const suggestions = fuse.search(symbolInput,{limit: 10});
      // console.log("suggestions", suggestions);

      const rowVirtualizer = useVirtualizer({
        count: suggestions.length,
        getScrollElement: () => parentRef.current,
        estimateSize: (i) => 40,
        overscan: 15,
      });
      return (
        <>
          <div
            ref={parentRef}
            style={{
              height: "20vh",
              width: `100%`,
              overflow: "auto",
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                return (
                  <div
                    key={virtualRow.index}
                    className={`cursor-pointer bg-white ${
                      virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
                    } text-left hover:bg-sky-300 leading-3 border-2 border-solid py-1 ${
                      suggestions[virtualRow.index].item.symbol ===
                      selectedSymbol
                        ? "bg-sky-200"
                        : null
                    }`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `40px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    onClick={() => {
                      clickSuggestion(suggestions[virtualRow.index]);
                      console.log("click");
                    }}
                  >
                    <span className="text-base">
                      {suggestions[virtualRow.index].item.symbol}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      );
    } else {
      return <></>;
    }
  };
  return (
    <>
      <div style={{ height: "5vh" }} className="flex relative z-50 w-full">
        <div className="mx-3">
          <form className=" h-full " onSubmit={handleSubmit}>
            <label>
              <input
                className="input text-center"
                type="search"
                name="name"
                placeholder="Symbol"
                value={symbolInput}
                onChange={(e) => {
                  setSymbolInput(e.target.value); setSearching(true)
                }}
                // onFocus={() => setSearching(true)}
                // onBlur={() => setSearching(false)}

              />
              <Suggestions/>
            </label>
          </form>
        </div>

        <div className="flex place-content-end place-self-start   w-full ">
          <button
            className="menuButton"
            onClick={() => dispatch(changePage("apiPage"))}
          >
            Api Page
          </button>
          <button className="menuButton" onClick={signOut}>
            <span>log out</span>{" "}
          </button>
        </div>
      </div>
    </>
  );
};
