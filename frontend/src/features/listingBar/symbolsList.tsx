import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateFocus, updateSymbol } from "../chart/chartSlice";
import { AllListings, ListingResponse } from "./ListBar";
import { FixedSizeList as List } from "react-window";
import { useClipsQuery } from "../../hooks/useClipsQuery";
import { useQueryClient } from "react-query";
import { defaultCategories } from "./defaultCategories";
import { Session } from "@supabase/supabase-js";
import { useDeleteUserClipMutation } from "../../hooks/UseDeleteUserClipMutation";

import { Clip } from "../../api/queries/getUserClipQuery";
import { AxiosResponse } from "axios";

type UserSymbolData = Omit<Clip, "user_id" | "created_at" | "category">;

export function symbolList(
  session: Session,
  UsHkData: AxiosResponse<ListingResponse, any> | undefined
) {
  const queryClient = useQueryClient();
  const [selectedSymbolId, setSelectedSymbolId] = useState<number>();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");

  const dispatch = useAppDispatch();
  const globalViewing = useAppSelector(selectViewing);
  const { data, isLoading } = useClipsQuery(session.user.id);
  const deleteUserClip = useDeleteUserClipMutation();
  function clickPublicSymbol(container: AllListings) {
    dispatch(updateSymbol(container.symbol + "." + container.market));

    dispatch(
      updateFocus({
        min: null,
        max: null,
      })
    );
  }

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

  function deleteCategory(userId: string, clipId: number) {
    if (window.confirm(`Are you sure to delete the record?`)) {
      deleteUserClip.mutate({ userId, clipId });
    }
  }
  if (isLoading) {
    return <span>Loading...</span>;
  } else if (data && UsHkData) {

    const userContainer: UserSymbolData[] = [];
    const publicContainer: AllListings[] = [];

    switch (globalViewing) {
      case "HK market":
        UsHkData.data.hk.forEach((el) =>
          publicContainer.push({ ...el, market: "HK" })
        );

        break;
      case "US market":
        UsHkData.data.us.forEach((el) =>
          publicContainer.push({ ...el, market: "US" })
        );

        break;
      case "":
        break;
      default:
        data.forEach((el: Clip) => {
          if (el.category === globalViewing)
            userContainer.push({
              symbol: el.symbol,
              starting: el.starting,
              ending: el.ending,
              id: el.id,
              market: el.market,
            });
        });
        break;
    }

    const Row = ({ index, style }: { index: number; style: any }) => {
      if (defaultCategories().some((el) => globalViewing === el)) {
        //return default market symbol
        return (
          <button
            style={style}
            className={`text-left hover:bg-sky-300 leading-3 border-2 border-solid py-1 ${
              publicContainer[index].symbol === selectedSymbol
                ? "bg-sky-200"
                : null
            }`}
            onClick={() => {
              clickPublicSymbol(publicContainer[index]);
              setSelectedSymbol(publicContainer[index].symbol);
            }}
          >
            <span className="text-base">{publicContainer[index].symbol}</span>
            <br />
            <span className="text-xs ">{publicContainer[index].engName}</span>
          </button>
        );
      } else if (globalViewing === "") {
        return <></>;
      } else {
        return (
          //return user's record symbol

          <div
            style={style}
            className={`flex hover:bg-sky-300 leading-3 border-2 border-solid p-2 ${
              userContainer[index].id === selectedSymbolId ? "bg-sky-200" : null
            }`}
          >
            <button
              className={"w-11/12"}
              onClick={() => {
                clickUserSymbol(userContainer[index]);
                userContainer[index].id
                  ? setSelectedSymbolId(userContainer[index].id)
                  : null;
              }}
            >
              <span className={"text-base"}>{userContainer[index].symbol}</span>
              <br />
              {userContainer[index].starting && userContainer[index].ending ? (
                <div className={"text-xs"}>
                  <span>{`From ${new Date(userContainer[index].starting!)
                    .toISOString()
                    .slice(0, 10)}`}</span>
                  <br />
                  <span>{`to ${new Date(userContainer[index].ending!)
                    .toISOString()
                    .slice(0, 10)}`}</span>
                </div>
              ) : (
                null
              )}
            </button>
            <br />

            <button
              className=""
              onClick={() => {
                deleteCategory(session.user.id, userContainer[index].id!);
              }}
            >
              <img
                className="h-4"
                src="https://img.icons8.com/material-rounded/256/delete-trash.png"
                alt=""
              />
            </button>
          </div>
        );
      }
    };
    return (
      <>
        <List
          className=""
          height={300}
          width={"100%"}
          itemSize={70}
          itemCount={
            publicContainer.length > 0
              ? publicContainer.length
              : userContainer.length
          }
          overscanCount={10}
        >
          {Row}
        </List>
      </>
    );
  }
}
