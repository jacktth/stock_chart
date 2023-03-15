import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateFocus, updateSymbol } from "../chart/chartSlice";
import { AllListings } from "./ListBar";
import { selectClip } from "./listSlice";
import { FixedSizeList as List } from "react-window";
import { useClipsQuery } from "../../hooks/useClipsQuery";
import { useQueryClient } from "react-query";
import { defaultCategories } from "./defaultCategories";
import { Session } from "@supabase/supabase-js";
import { useDeleteUserClipMutation } from "../../hooks/UseDeleteUserClipMutation";

export function symbolList(session: Session, UsHkData) {
  const queryClient = useQueryClient();
  const [selectedSymbolId, setSelectedSymbolId] = useState<number>();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  const dispatch = useAppDispatch();
  const globalViewing = useAppSelector(selectViewing);
  const { data, isLoading } = useClipsQuery(session.user.id);
  const deleteUserClip = useDeleteUserClipMutation();
  function clickEventHandler(container: AllListings[], index: any) {
    dispatch(
      updateSymbol(container[index].symbol + "." + container[index].market)
    );

    queryClient.invalidateQueries("stockData");

    if (container[index].starting && container[index].ending) {
      dispatch(
        updateFocus({
          min: container[index].starting,
          max: container[index].ending,
        })
      );
    } else {
      dispatch(
        updateFocus({
          min: null,
          max: null,
        })
      );
    }
  }

  function deleteCategory(userId: string, clipId: number) {
    if (window.confirm(`Are you sure to delete the record?`)) {
      deleteUserClip.mutate({ userId, clipId });
    }
  }
  if (isLoading) {
    return <span>Loading...</span>;
  } else if (data && UsHkData) {
    const container: AllListings[] = [];
    switch (globalViewing) {
      case "HK market":
        UsHkData.data.hk.forEach((el) =>
          container.push({ ...el, market: "HK" })
        );

        break;
      case "US market":
        UsHkData.data.us.forEach((el) =>
          container.push({ ...el, market: "US" })
        );

        break;
      case "":
        break;
      default:
        data.forEach((el) => {
          if (el.category === globalViewing)
            container.push({
              symbol: el.symbol,
              market: el.market,
              starting: el.starting,
              ending: el.ending,
              id: el.id,
            });
        });
        break;
    }

    const Row = ({ index, style }) => {
      if (defaultCategories().some((el) => globalViewing === el)) {
        return (
          <button
            style={style}
            className={`text-left hover:bg-sky-300 leading-3 border-2 border-solid ${
              container[index].symbol === selectedSymbol ? "bg-sky-200" : null
            }`}
            onClick={() => {
              clickEventHandler(container, index);
              setSelectedSymbol(container[index].symbol);
            }}
          >
            <span className="text-base">{container[index].symbol}</span>
            <br />
            <span className="text-xs ">{container[index].engName}</span>
          </button>
        );
      } else if (globalViewing === "") {
        return <></>;
      } else {
        return (
          <button
            style={style}
            className={`flex hover:bg-sky-300 leading-3 border-2 border-solid p-2 ${
              container[index].id === selectedSymbolId ? "bg-sky-200" : null
            }`}
          >
            <button
              className={"w-11/12"}
              onClick={() => {
                clickEventHandler(container, index);
                container[index].id
                  ? setSelectedSymbolId(container[index].id)
                  : null;
              }}
            >
              {container[index].symbol}
            </button>
            <br />
            {/* <span className="text-xs ">{container[index].engName}</span> */}

            <button
              className=""
              onClick={() => {
                  deleteCategory(session.user.id, container[index].id!);
              }}
            >
              <img
                className="h-4"
                src="https://img.icons8.com/material-rounded/256/delete-trash.png"
                alt=""
              />
            </button>
          </button>
        );
      }
    };
    return (
      <>
        {/* <div className="flex text-sm">
            <img
              src={`https://flagcdn.com/${globalViewing.toLocaleLowerCase()}.svg`}
              width="20%"
              height="20%"
            />
            <span>{globalViewing.toLocaleUpperCase()} Market</span>
          </div> */}
        <List
          className=""
          height={300}
          width={"100%"}
          itemSize={70}
          itemCount={container.length}
          overscanCount={10}
        >
          {Row}
        </List>
      </>
    );
  }
}
