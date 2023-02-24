import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectSymbol } from "./chartSlice";
import axios from "axios";
import dataSorting from "./dataSorting";
import { Listing, ListingBar } from "../listingBar/ListBar";
import "../../index.css";

export function Chart() {
  // const symbol = useAppSelector(selectSymbol);
  const dispatch = useAppDispatch();
  const [stockData, setStockData] = useState<any>();
  const [symbol, setSymbol] = useState("AAPL");
  const [listings, setListing] = useState<Listing>();
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
        symbol: symbol,
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
    e.preventDefault();
  };
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
  }, []);
  const symbolOnChange = (e) => {
    setSymbol(e.target.value);
    e.preventDefault();
  };

  const options = {
    title: {
      text: symbol + " " + error ,
    },
    series: [
      {
        type: "candlestick",

        data: stockData,
      },
    ],
  };
  const listBar = (listing) => {
    if (listing) {
      return <ListingBar listings={listing} />;
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
                value={symbol}
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
