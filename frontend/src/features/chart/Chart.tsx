import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, { useEffect, useState } from "react";
import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectMarket,
  selectMinMax,
  selectSymbol,
  updateMinMax,
  updateSymbol,
} from "./chartSlice";
import axios from "axios";
import dataSorting from "./dataSorting";
import { ListingBar, ListingProp } from "../listingBar/ListBar";
import "../../index.css";
import indicatorsAll from "highcharts/indicators/indicators-all";
import annotationsAdvanced from "highcharts/modules/annotations-advanced";
import priceIndicator from "highcharts/modules/price-indicator";
import fullScreen from "highcharts/modules/full-screen";
import stockTools from "highcharts/modules/stock-tools";
indicatorsAll(Highcharts);
annotationsAdvanced(Highcharts);
priceIndicator(Highcharts);
fullScreen(Highcharts);
stockTools(Highcharts);
export function Chart() {
  const globalSymbol = useAppSelector(selectSymbol);
  const globalMarket = useAppSelector(selectMarket);
  const globalMinMax = useAppSelector(selectMinMax);
  const dispatch = useAppDispatch();
  const [symbol, setSymbol] = useState<string>(globalSymbol);
  const [stockData, setStockData] = useState<any>();
  const [listings, setListing] = useState(null);
  const [error, setError] = useState<any>("no error");
  const [minMax, setMinMax] = useState({
    min: 1643846400000,
    max: 1644278400000,
  });
  // const [selectMinMax, setSelectMinMax] = useState({ min: 0, max: 0 });
  const [options, setOptions] = useState<Highcharts.Options>({
    xAxis: {
      min: 1644278400000,
      max: 1664236800000,
      //   plotBands: [{ // mark the weekend
      //     color: '#FCFFC5',
      //     from: Date.UTC(2010, 0, 2),
      //     to: Date.UTC(2010, 0, 4),
      //     events: {
      //         click: e => {
      //             report.innerHTML = e.;
      //         },
      //         mouseover: e => {
      //             report.innerHTML = e.type;
      //         },
      //         mouseout: e => {
      //             report.innerHTML = e.type;
      //         }
      //     }
      // }],
    },
    chart: {
      zooming: {
        type: "x",
      },
      events: {
        selection: (e) => {
          // alert(e.xAxis[0].min)
          // setSelectMinMax({...selectMinMax, min: e.xAxis[0].min, max: e.xAxis[0].max });
          dispatch(updateMinMax({ min: e.xAxis[0].min, max: e.xAxis[0].max }));
          // setOptions({
          //   ...options,
          //   title: {
          //     text: error + symbol + globalMinMax.min + globalMinMax.min,
          //   },
          // });
          return false; // Don't zoom
        },
      },
      panning: {
        enabled: false,
      },
    },

    plotOptions: {
      series: {
        cursor: "pointer",

        point: {
          events: {
            click: function (e) {
              // alert("Category: " + this.category + ", value: " + this.x);
            },
          },
        },
      },
    },
    title: {
      text: error + symbol + globalMinMax.min + globalMinMax.min,
    },
  });
  useEffect(() => {
    setOptions({
      ...options,
      title: {
        text: error + symbol + globalMinMax.min + globalMinMax.min,
      },
      xAxis:{
        ...options.xAxis,
        plotBands: [{ // mark the weekend
              color: '#FCFFC5',
              from: globalMinMax.min,
              to: globalMinMax.max}]
      }
    });
  }, [globalMinMax]);

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
            series: [
              { type: "candlestick", data: sortedData, allowPointSelect: true },
            ],
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
          {/* the conditions to prevent multi re-render until stock data is fetched from server*/}
          {options.series ? (
            <HighchartsReact
              containerProps={{ className: "h-screen" }}
              highcharts={Highcharts}
              constructorType={"stockChart"}
              options={options}
            />
          ) : (
            "error"
          )}
        </div>
      </div>
    </div>
  );
}
