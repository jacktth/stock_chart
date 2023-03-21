import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateFocus, updateSymbol } from "../chart/chartSlice";
import { AllListings } from "./ListBar";
import { ListingData } from "./types";

export function PublicSymbols({market,data}:{market:string,data:ListingData[]} ) {
  
  const globalViewing = useAppSelector(selectViewing);
  const dispatch = useAppDispatch();
  const parentRef = React.useRef(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i)=>50,
    overscan: 15,
  });
  function clickPublicSymbol(container: AllListings) {
    dispatch(updateSymbol(container.symbol + "." + container.market));

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
          height: "65vh",
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
              className={`${
                virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
              } text-left hover:bg-sky-300 leading-3 border-2 border-solid py-1 ${
                data[virtualRow.index].symbol === selectedSymbol
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
                setSelectedSymbol(data[virtualRow.index].symbol);
              }}
            >
              <span className="text-base">{data[virtualRow.index].symbol}</span>
            </div>
          ))}
        </div>
      </div>
  );
}
