import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectMarket, selectSymbol, updateSymbol } from "./chartSlice";
import axios from "axios";
import dataSorting from "./dataSorting";
import { ListingBar, ListingProp } from "../listingBar/ListBar";
import "../../index.css";

export function Chart() {
  const globalSymbol = useAppSelector(selectSymbol);
  const globalMarket = useAppSelector(selectMarket);
  const dispatch = useAppDispatch();
  const [symbol, setSymbol] = useState<string>(globalSymbol);
  const [stockData, setStockData] = useState<any>();
  const [listings, setListing] = useState(null);
  const [error, setError] = useState<any>("no error");
  const [minMax, setMinMax] = useState({
    min: 1643846400000,
    max: 1644278400000,
  });
  const [options, setOptions] = useState<Highcharts.Options>({
    xAxis: {
      min: 1644278400000,
      max: 1664236800000,
    },

    // chart: {
    //   events: {
    //     load: function () {
    //       const chart = this;

    //       chart.xAxis[0].setExtremes(1644278400000, 1651622400000, move);
    //       setMove(false);
    //     },
    //   },
    // },

    plotOptions: {
      series: {
        cursor: "pointer",
        point: {
          events: {
            click: function () {
              alert("Category: " + this.category + ", value: " + this.x);
            },
          },
        },
      },
    },
    title: {
      text: error + symbol,
    },
    // series: [
    //   {
    //     type: "candlestick",
    //     // data: stockData,
    //     //[[1644278400000, 174.830002,168.880005,142.880005,148.880005],
    //     //   [1644364800000, 176.279999,168.880005,142.880005,148.880005],
    //     //   [1644451200000, 172.119995,168.880005,142.880005,148.880005],
    //     //   [1644537600000, 168.639999,168.880005,142.880005,148.880005],
    //     //   [1644796800000, 168.880005,168.880005,142.880005,148.880005],
    //     //   [1644883200000, 172.789993,168.880005,142.880005,148.880005],
    //     //   [1644969600000, 172.550003,168.880005,142.880005,148.880005],
    //     // [1645056000000, 168.880005,168.880005,142.880005,148.880005],
    //     //   [1645142400000, 167.300003,168.880005,142.880005,148.880005],
    //     //   [1645488000000,168.880005,168.880005,142.880005,148.880005,]
    //     //  ]
    //   },
    // ],
  });

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
  // useEffect(() => {
  //   axios
  //     .post("http://localhost:3000/stock-data", {
  //       symbol: globalSymbol,
  //       market: globalMarket,
  //       period1: "2022-02-01",
  //     })
  //     .then(
  //       ({ data, status }) => {
  //         setSymbol(globalSymbol);
  //         setError(status);
  //         const sortedData = dataSorting(data);
  //         setStockData(sortedData);
  //       },
  //       (error) => {
  //         setError(error);
  //       }
  //     );
  // }, []);

  useEffect(() => {
    axios
      .post("http://localhost:3000/stock-data", {
        symbol: globalSymbol,
        market: globalMarket,
        period1: "2022-02-01",
      })
      .then(
        ({ data, status }) => {
          // setSymbol(globalSymbol);
          setError(status);
          const sortedData = dataSorting(data);
          setStockData(sortedData);
          setOptions({
            ...options,
            series: [{type:"candlestick",data:sortedData}],
          });
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

  const listBar = (list: ListingProp | null) => {
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
          {options.series ? <HighchartsReact
            containerProps={{ className: "h-screen" }}
            highcharts={Highcharts}
            constructorType={"stockChart"}
            options={options}
          /> :null}
         
        </div>
      </div>
    </div>
  );
}
