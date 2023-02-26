import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectMarket, selectSymbol, updateSymbol } from "./chartSlice";
import axios from "axios";
import dataSorting from "./dataSorting";
import {  ListingBar, ListingProp } from "../listingBar/ListBar";
import "../../index.css";

export function Chart() {
  const globalSymbol = useAppSelector(selectSymbol);
  const globalMarket = useAppSelector(selectMarket)
  const dispatch = useAppDispatch();
  const [symbol,setSymbol] = useState<string>(globalSymbol)
  const [stockData, setStockData] = useState<any>();
  const [listings, setListing] = useState(null);
  const [error, setError] = useState<any>("no error");
  useEffect(() => {
    axios.get("http://localhost:3000/listing").then(
      ({ data, status }) => {
        setError(status);
        setListing(data);
      },
      // Note: it's important to handle errors here
      // instead of a catch() block so that we don't swallow
      // exceptions from actual bugs in components.
      (error) => {
        setError(error);
      }
    );
  }, []);
  const handleSubmit = (e) => {
    axios
      .post("http://localhost:3000/stock-data", {
        symbol: globalSymbol,
        period1: "2022-02-01",
      })
      .then(
        ({ data, status }) => {
          setError(status);
          const sortedData = dataSorting(data);
          setStockData(sortedData);
        },
        (error) => {
          setError(error);
        }
      );
    e.preventDefault();
  };
  useEffect(() => {
    axios
      .post("http://localhost:3000/stock-data", {
        symbol: globalSymbol,
        market: globalMarket,
        period1: "2022-02-01",
      })
      .then(
        ({ data, status }) => {
          setSymbol(globalSymbol)
          setError(status);
          const sortedData = dataSorting(data);
          setStockData(sortedData);
        },
        (error) => {
          setError(error);
        }
      );
  }, []);

  useEffect(() => {
    axios
      .post("http://localhost:3000/stock-data", {
        symbol: globalSymbol,
        market: globalMarket,
        period1: "2022-02-01",
      })
      .then(
        ({ data, status }) => {
          setSymbol(globalSymbol)

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
  }, [globalSymbol]);
  
  const symbolOnChange = (e) => {
    dispatch(updateSymbol(e.target.value));
    e.preventDefault();
  };

  const options = {
    title: {
      text:  error + symbol ,
    },
    series: [
      {
        type: "candlestick",

        data: stockData,
      },
    ],
  };
  const listBar = (list:ListingProp|null) => {
    if (list) {
      return <ListingBar hk={list.hk} us={list.us} />;
    }
    return <div></div>;
  };
  return (
    <div className="view-full">
      <div className="flex view-full">
     

        <div className="SearchBar">
          <form className="w-full" onSubmit={handleSubmit}>
            <label>
              <input
                className="inputSymbol"
                type="text"
                name="name"
                value={globalSymbol}
                onChange={symbolOnChange}
              />
            </label>
          </form>
          {listBar(listings)}
        </div>
        <div className="chartContainer">
          <HighchartsReact
            containerProps={{ className: "h-screen" }}
            highcharts={Highcharts}
            constructorType={"stockChart"}
            options={options}
          />
        </div>
        
      </div>
    </div>
  );
}
