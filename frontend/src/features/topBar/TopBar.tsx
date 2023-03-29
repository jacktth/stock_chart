import React, { useState } from "react";
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

export const TopBar = ({ session }: { session: Session }) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<any>("no error");
  const [symbolInput, setSymbolInput] = useState<string>("");
  const globalSymbol = useAppSelector(selectSymbol);
  const parentRef = React.useRef(null);
  const queryClient = useQueryClient();
  const globalSelectedCategory = useAppSelector(selectedCategory);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };
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
  const fetchListings = () =>
    axios.get<ListingData[]>("http://localhost:3000/listing", {
      params: {
        market: globalSelectedCategory,
      },
    });

  //globalSelectedCategory must be in the list of useQuery to refresh data
  const {
    data: listingResponse,
    isLoading: listingIsLoading,
    isSuccess: listingIsSuccess,
  } = useQuery(["listings", globalSelectedCategory], fetchListings, {});
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  // const Suggestions = () => {
  //   if (listingResponse && symbolInput.length>0) {
      
  //     const symbols = listingResponse.data;
  //     const suggestions:string[] = []
  //     for(let i of symbols){
  //       if(suggestions.length>5){break}
  //       const symbolSliced = i.symbol.slice(0,symbolInput.length).toLowerCase()
  //     console.log("begin",symbolSliced);

  //       if(symbolSliced.includes(symbolInput)){
  //         suggestions.push(i.symbol)
  //       }
  //     }
  //     console.log("begin",symbolInput);

  //     const rowVirtualizer = useVirtualizer({
  //       count: symbols.length,
  //       getScrollElement: () => parentRef.current,
  //       estimateSize: (i) => 40,
  //       overscan: 15,
  //     });
  //     return (
  //       <>
  //         <div
  //           ref={parentRef}
  //           className=""
  //           style={{
  //             height: "20vh",
  //             width: `100%`,
  //             overflow: "auto",
  //           }}
  //         >
  //           <div
  //             style={{
  //               height: `${rowVirtualizer.getTotalSize()}px`,
  //               width: "100%",
  //               position: "relative",
  //             }}
  //           >
  //             {rowVirtualizer.getVirtualItems().map((virtualRow) =>{
  //               return <div></div>
  //             })
  //               }
  //           </div>
  //         </div>
  //       </>
  //     );
  //   } else{
  //     return <></>
  //   }
  // };
  return (
    <>
      <div style={{ height: "7vh" }} className="flex justify-between relative">
        <div>
          <form className=" h-full " onSubmit={handleSubmit}>
            <label>
              <input
                className="input text-center"
                type="search"
                name="name"
                placeholder="Symbol"
                value={symbolInput}
                onChange={(e) => setSymbolInput(e.target.value)}
              />
            </label>
          </form>
        </div>
        <div>
          <button onClick={() => dispatch(changePage("apiPage"))}>
            Your record Api
          </button>
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
