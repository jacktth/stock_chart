import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { Clip } from "../../api/queries/getUserClipQuery";
import { useAppDispatch } from "../../app/hooks";
import { useDeleteUserClipMutation } from "../../hooks/UseDeleteUserClipMutation";
import { updateFocus, updateSymbol } from "../chart/chartSlice";
import ClearIcon from '@mui/icons-material/Clear';
import { Session } from "@supabase/supabase-js";
type UserSymbolData = Omit<Clip, "user_id" | "created_at" | "category">;

export function UserSymbols({ userSymbols,session }: { userSymbols: Clip[],session:Session }) {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const deleteUserClip = useDeleteUserClipMutation();
  const parentRef = React.useRef(null);
  const [selectedSymbolId, setSelectedSymbolId] = useState<number>();

  function clickUserSymbol(symbols: UserSymbolData) {
    dispatch(updateSymbol(symbols.symbol + "." + symbols.market));

    queryClient.invalidateQueries("stockData");
    if (symbols.starting !== undefined && symbols.ending) {
      dispatch(
        updateFocus({
          min: symbols.starting,
          max: symbols.ending,
        })
      );
    } else if (!symbols.starting && !symbols.ending) {
      dispatch(
        updateFocus({
          min: null,
          max: null,
        })
      );
    }
  }
  const rowVirtualizer = useVirtualizer({
    count: userSymbols.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => 70,
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
              className={`flex justify-between ${
                virtualRow.index % 2 ? "ListItemOdd" : "ListItemEven"
              }  hover:bg-sky-300 leading-3 border-2 border-solid p-2 ${
                userSymbols[virtualRow.index].id === selectedSymbolId
                  ? "bg-sky-200"
                  : null
              }`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `70px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              onClick={() => {
                clickUserSymbol(userSymbols[virtualRow.index]);
                userSymbols[virtualRow.index].id
                  ? setSelectedSymbolId(userSymbols[virtualRow.index].id)
                  : null;
              }}
            >
              <div>
                <span className={"text-base"}>
                  {userSymbols[virtualRow.index].symbol}
                </span>
              
              {userSymbols[virtualRow.index].starting &&
              userSymbols[virtualRow.index].ending ? (
                <div className={"text-xs"}>
                  <span>{`From ${new Date(
                    userSymbols[virtualRow.index].starting!
                  )
                    .toISOString()
                    .slice(0, 10)}`}</span>
                  <br />
                  <span>{`to ${new Date(userSymbols[virtualRow.index].ending!)
                    .toISOString()
                    .slice(0, 10)}`}</span>
                </div>
              ) : null}
              </div>
              <button className="flex h-1" onClick={()=>deleteUserSymbol(session.user.id,userSymbols[virtualRow.index].id)}>
              <ClearIcon fontSize="small" className="self-start"/>
              </button>
            </div>
          ))}
        </div>

        <div>
         
        </div>
      </div>
    </>
  );
}
