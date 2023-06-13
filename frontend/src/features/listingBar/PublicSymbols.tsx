import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSymbol, selectViewing, updateFocus, updateSymbol } from "../chart/chartSlice";
import { ListingData } from "./types";
import { log } from "console";

const PublicSymbols = ({market,data}:{market:string,data:ListingData[]} ) => {
  
  const globalViewing = useAppSelector(selectViewing);
  const dispatch = useAppDispatch();
  const parentRef = React.useRef(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const globalSymbol = useAppSelector(selectSymbol);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i)=>50,
    overscan: 15,
  });
  function clickPublicSymbol(container: ListingData) {
    dispatch(updateSymbol(container.symbol + "." + container.market));
    setSelectedSymbol(container.symbol);
    dispatch(
      updateFocus({
        min: null,
        max: null,
      })
    );
  }
  return (
      <div
        ref={parentRef}
        style={{
          height: "66vh",
          width: "100%",
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
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={`cursor-pointer ${
                virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
              } text-left hover:bg-sky-300 leading-3 border-2 border-solid py-1 ${
                data[virtualRow.index].symbol == globalSymbol
                  ? "bg-sky-200"
                  : null
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `50px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              onClick={() => {
                clickPublicSymbol(data[virtualRow.index]);
              }}
            >
              <span className="text-base">{data[virtualRow.index].symbol}</span>
            </div>
          ))}
        </div>
      </div>
  );
}

export default PublicSymbols;