import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectViewing, updateFocus, updateSymbol } from "../chart/chartSlice";
import { AllListings } from "./ListBar";
import { selectClip } from "./listSlice";
import { FixedSizeList as List } from "react-window";
import { useClipsQuery } from "../../hooks/useClipsQuery";
import { useQueryClient } from "react-query";

export function symbolList(session, UsHkData) {
  const queryClient = useQueryClient();

  const dispatch = useAppDispatch();
  const globalClip = useAppSelector(selectClip);
  const globalViewing = useAppSelector(selectViewing);
  const { data } = useClipsQuery(session.user.id);
  function clickEventHandler(container: AllListings[], index: any) {
    dispatch(
      updateSymbol(container[index].symbol + "." + container[index].market)
    );
    
    queryClient.invalidateQueries("stockData")
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
  if (data && UsHkData)  {
    
    const container: AllListings[] = [];
    switch (globalViewing) {
      case "hk":
        UsHkData.data.hk.forEach((el) =>
          container.push({ ...el, market: "HK" })
        );

        break;
      case "us":
        UsHkData.data.us.forEach((el) =>
          container.push({ ...el, market: "US" })
        );

        break;
      default:
        data.forEach((el) => {
          if (el.category === globalViewing && el.starting && el.ending)
            container.push({
              symbol: el.symbol,
              market: el.market,
              starting: el.starting,
              ending: el.ending,
            });
        });
        break;
    }
    const Row = ({ index, style }) => (
      <div
        style={style}
        className="hover:bg-sky-300 leading-3 border-2 border-solid p-2"
        onClick={() => clickEventHandler(container, index)}
      >
        <span>{container[index].symbol}</span>
        <br />
        <span className="text-xs ">{container[index].engName}</span>
      </div>
    );
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
