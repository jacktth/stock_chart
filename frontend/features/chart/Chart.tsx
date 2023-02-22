import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectSymbol } from "./chartSlice";
import axios from "axios";
import dataSorting from "./dataSorting";

export function Chart() {
  // const symbol = useAppSelector(selectSymbol);
  const dispatch = useAppDispatch();
  const [stockData, setStockData] = useState<any>();
  const [symbol, setSymbol] = useState("AAPL");
  const [error, setError] = useState<any>("no error");
  useEffect(() => {
    axios
      .post("http://localhost:3000/stock-data", {
        symbol: "AAPL",
        period1: "2022-02-01",
      })
      .then(
        ({ data, status }) => {
          setError(status);
          const sortedData = dataSorting(data);
          setStockData(sortedData);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setError(error);
        }
      );
  }, [symbol]);
  const onChangeSymbolHandler = (e) => {
    setSymbol(e.target.value);
  };
  const options = {
    title: {
      text: symbol + " " + error,
    },
    series: [
      {
        data: stockData,
      },
    ],
  };

  return (
    <div>
      <input
        type="text"
        name="name"
        onChange={onChangeSymbolHandler}
        value={symbol}
      />
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
}
