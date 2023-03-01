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
  const dispatch = useAppDispatch();
  const [symbol, setSymbol] = useState<string>(globalSymbol);
  const [stockData, setStockData] = useState<any>();
  const [listings, setListing] = useState(null);
  const [error, setError] = useState<any>("no error");
  const [minMax, setMinMax] = useState({
    min: 1643846400000,
    max: 1644278400000,
  });
  const [dateArray, setDateArray] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<{
    start: number;
    end: number;
  }>({
    start: 0,
    end: 0,
  });
  // const [selectMinMax, setSelectMinMax] = useState({ min: 0, max: 0 });
  const [options, setOptions] = useState<Highcharts.Options>({
    xAxis: {
      min: 1644278400000,
      max: 1664236800000,
    },
    chart: {
      zooming: {
        type: "x",
      },
      events: {
        selection: (e) => {
          //in this function, it is not recommend to use any setState hook to update the state
          //because the setState  will only return init value
          const min = e.xAxis[0].min;
          const max = e.xAxis[0].max;
          setMinMax({ min: min, max: max });

          return false; // returning false will disable the default zooming function while dragging on the chart
        },
        click: () => {
          setMinMax({ min: 0, max: 0 });
        },
      },
      panning: {
        enabled: false, //this disables the scrolling function on the chart but no effect to the scroll bar
      },
    },

    plotOptions: {
      series: {
        cursor: "pointer",

        point: {
          events: {
            click: function (e) {
              alert("Category: " + this.category + ", value: " + this.x);
            },
          },
        },
      },
    },
    title: {
      text: error + symbol,
    },
  });
  useEffect(() => {
    //this hook is to update the selected data range on the chart
    const max = minMax.max
    const min = minMax.min
    const start = min!=0 && min <=dateArray[0] ?dateArray[0] :  dateArray.reduce(
      (acc, curr, i, arr) =>
        i > 0 && min - curr < 0 && min - arr[i - 1] > 0
          ? (arr[i - 1] + curr) / 2 <= min
            ? curr
            : arr[i - 1]
          : acc,
      0
    );
    const end = max>=dateArray.slice(-1)[0] ?dateArray.slice(-1)[0] :  dateArray.reduce(
      (acc, curr, i, arr) =>
        i > 0 && max - curr < 0 && max - arr[i - 1] > 0
          ? (arr[i - 1] + curr) / 2 <= max
            ? curr
            : arr[i - 1]
          : acc,
      0
    );
    // const end = dateArray.reduce((acc,curr,i,arr) =>  ( i!==0 || (curr>minMax.min && arr[i-1]<minMax.max )) ?curr :acc ,0)
    setOptions({
      ...options,
      title: {
        text: error + symbol + start + " " + end,
      },
      xAxis: {
        ...options.xAxis,
        plotBands: [
          {
            color: "#FCFFC5",
            from: start,
            to: end,
          },
        ],
      },
    });

    // setSelectedDate({
    //   // start: selectedDate.date.reduce((acc,curr,i,arr) =>  ( i!==0 || (curr>min && arr[i-1]<max )) ?arr[i-1] :acc ,0),
    //   start: dateArray[0],
    //   end:dateArray[4]
    //   // end: selectedDate.date.find((el, i,arr) =>   !i || (el>max && arr[i-1]<max ) )!,
    // });
  }, [minMax]);

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
          setStockData(sortedData.stockData);
          setDateArray(sortedData.date);
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
          setDateArray(sortedData.date);
          setOptions({
            ...options,
            series: [
              {
                type: "candlestick",
                data: sortedData.stockData,
                allowPointSelect: true,
              },
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
