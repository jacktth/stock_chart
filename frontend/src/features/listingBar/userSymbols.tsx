import { Session } from "@supabase/gotrue-js/dist/module/lib/types";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { Clip } from "../../api/queries/getUserClipQuery";
import { Database } from "../../api/types/supabase";
import { useAppDispatch } from "../../app/hooks";
import { useClipsQuery } from "../../hooks/useClipsQuery";
import { useDeleteUserClipMutation } from "../../hooks/UseDeleteUserClipMutation";
import { updateFocus, updateSymbol } from "../chart/chartSlice";
type UserSymbolData = Omit<Clip, "user_id" | "created_at" | "category">;

export function UserSymbols({userSymbols}:{userSymbols:Clip[]}) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const deleteUserClip = useDeleteUserClipMutation();
  const parentRef = React.useRef(null);
  const [selectedSymbolId, setSelectedSymbolId] = useState<number>();

  function clickUserSymbol(container: UserSymbolData) {
    dispatch(updateSymbol(container.symbol + "." + container.market));

    queryClient.invalidateQueries("stockData");
    if (container.starting !== undefined && container.ending) {
      dispatch(
        updateFocus({
          min: container.starting,
          max: container.ending,
        })
      );
    }
  }
  const rowVirtualizer = useVirtualizer({
    count: userSymbols.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i)=>50,
    overscan: 15,
  });
  function deleteUserSymbol(userId: string, clipId: number) {
    if (window.confirm(`Are you sure to delete the record?`)) {
      deleteUserClip.mutate({ userId, clipId });
    }
  }

  return (
    <>
      <div
        ref={parentRef}
        className="List"
        style={{
          height: `70%`,
          width: `100%`,
          overflow: "auto"
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative"
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <div
              key={virtualRow.index}
              className={`${virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"} flex hover:bg-sky-300 leading-3 border-2 border-solid p-2 ${
                userSymbols[virtualRow.index].id === selectedSymbolId ? "bg-sky-200" : null
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `50px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
              onClick={() => {
                clickUserSymbol(userSymbols[virtualRow.index]);
                userSymbols[virtualRow.index].id
                  ? setSelectedSymbolId(userSymbols[virtualRow.index].id)
                  : null;
              }}
            >
              <span className={"text-base"}>{userSymbols[virtualRow.index].symbol}</span>
              <br />
              {userSymbols[virtualRow.index].starting && userSymbols[virtualRow.index].ending ? (
                <div className={"text-xs"}>
                  <span>{`From ${new Date(userSymbols[virtualRow.index].starting!)
                    .toISOString()
                    .slice(0, 10)}`}</span>
                  <br />
                  <span>{`to ${new Date(userSymbols[virtualRow.index].ending!)
                    .toISOString()
                    .slice(0, 10)}`}</span>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
