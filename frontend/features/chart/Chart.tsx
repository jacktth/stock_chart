import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { HistoricalHistoryResult } from 'yahoo-finance2/dist/esm/src/modules/historical';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectSymbol } from "./chartSlice";

export function Chart() {
  // const symbol = useAppSelector(selectSymbol);
  const dispatch = useAppDispatch();
  const [stockData, setStockData] = useState<HistoricalHistoryResult>([]);
  const [symbol, setSymbol] = useState("AAPL");

const  onChangeSymbolHandler = async (e) => {
  setSymbol(e.target.value);
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({symbol:"AAPL",period1:'2023-02-01' })}
    // body: JSON.stringify({symbol:"AAPL",period1:"2023-02-01" })}
  try {
    const response = await fetch('http://localhost:3000/stock-data',requestOptions)
    const data = await response.json();
    setStockData(data)
  } catch (error) {
    alert(error + requestOptions.body);
  }
  
};
  //   const [symbol, setSymbol] = useState('2');
  const options = {
    title: {
      text: symbol,
    },
    series: [
      {
        data: [1, 2, 1, 4, 3, 6, 7, 3, 8, 6, 9],
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
