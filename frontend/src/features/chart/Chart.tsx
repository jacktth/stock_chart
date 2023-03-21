import Highcharts, { StockChart } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectFocus,
  selectMarket,
  selectSymbol,
  updateFocus,
  updateSelectedData,
  updateSymbol,
} from "./chartSlice";
import axios from "axios";
import dataSorting from "./dataSorting";
import { ListingBar } from "../listingBar/ListBar";
import "../../index.css";
import indicatorsAll from "highcharts/indicators/indicators-all";
import annotationsAdvanced from "highcharts/modules/annotations-advanced";
import priceIndicator from "highcharts/modules/price-indicator";
import fullScreen from "highcharts/modules/full-screen";
import stockTools from "highcharts/modules/stock-tools";
import { supabase } from "../../api/supabaseClient";
import { selectAuth, updateAuth } from "../auth/authSlice";
import { SaveBar, SelectedData } from "../listingBar/SaveBar";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Session } from "@supabase/supabase-js";
import { createPortal } from "react-dom";
import { dateDiff, ymd } from "./utils";
import { TopBar } from "../topBar/TopBar";
indicatorsAll(Highcharts);
annotationsAdvanced(Highcharts);
priceIndicator(Highcharts);
fullScreen(Highcharts);
stockTools(Highcharts);

export function Chart() {
  const dispatch = useAppDispatch();
  const globalSymbol = useAppSelector(selectSymbol);
  const globalMarket = useAppSelector(selectMarket);
  const globalAuth = useAppSelector(selectAuth);
  const globalFocus = useAppSelector(selectFocus);
  const queryClient = useQueryClient();
  // const { data } = useUserQuery();
  const chartComponent = useRef<HighchartsReact.RefObject>(null);
  const fetchStockData = () =>
    axios.get("http://localhost:3000/stock-data", {
      params: {
        symbol: globalSymbol,
        market: globalMarket,
        period1: "2022-02-01",
      },
    });
  //globalSymbol in useQuery is necessary
  useQuery(["stockData", globalSymbol], fetchStockData, {
    onSuccess(data) {
      setDateArray(dataSorting(data.data).date);
      setOptions({
        ...options,
        xAxis: {
          ...options.xAxis,
          plotBands: [{}],
        },
        series: [
          {
            type: "candlestick",
            data: dataSorting(data.data).stockData,
            allowPointSelect: true,
          },
        ],
      });
      if (chartComponent.current !== null) {
        const chart = chartComponent.current.chart;
        //function to focus the range of selected data from the record
        //default focus 100 days
        //change it to undefined if you want to view all data
        chart.xAxis[0].setExtremes(
          globalFocus.min
            ? globalFocus.min
            : dataSorting(data.data).date.at(-100),
          globalFocus.max ? globalFocus.max : dataSorting(data.data).date.at(-1)
        );
      }
    },
  });
  const [dateArray, setDateArray] = useState<number[]>([]);
  const [selectedData, setSelectedData] = useState<SelectedData>({
    starting: 0,
    ending: 0,
  });
  const [options, setOptions] = useState<Highcharts.Options>({
    chart: {
      zooming: {
        type: "x",
      },
      events: {
        selection: (e) => {
          //in this function, it is useless to use its setState hook to update the its state
          //because the setState won't update anything about itself
          const min = e.xAxis[0].min;
          const max = e.xAxis[0].max;

          setSelectedData({ starting: min, ending: max });

          return false; // returning false will disable the default zooming function while dragging on the chart
        },
        click: () => {
          setSelectedData({ starting: 0, ending: 0 });
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
          // events: {
          //   click: function (e) {
          //     alert("Category: " + this.category + ", value: " + this.x);
          //   },
          // },
        },
      },
    },

    rangeSelector: {
      buttons: [],
    },
  });
  useEffect(() => {
    //this hook is to update the selected data range on the chart
    const max = selectedData.ending !== null ? selectedData.ending : 0;
    const min = selectedData.starting !== null ? selectedData.starting : 0;
    const start =
      min != 0 && min <= dateArray[0]
        ? dateArray[0]
        : dateArray.reduce(
            (acc, curr, i, arr) =>
              i > 0 && min - curr < 0 && min - arr[i - 1] > 0
                ? (arr[i - 1] + curr) / 2 <= min
                  ? curr
                  : arr[i - 1]
                : acc,
            0
          );
    const end =
      max >= dateArray.slice(-1)[0]
        ? dateArray.slice(-1)[0]
        : dateArray.reduce(
            (acc, curr, i, arr) =>
              i > 0 && max - curr < 0 && max - arr[i - 1] > 0
                ? (arr[i - 1] + curr) / 2 <= max
                  ? curr
                  : arr[i - 1]
                : acc,
            0
          );
    setOptions({
      ...options,
      title: {
        text: `Selected from ${start === 0 ? "___" : ymd(start)} to ${
          end === 0 ? "___" : ymd(end)
        } (${dateDiff(start, end)})days`,
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
    dispatch(updateSelectedData({ starting: start, ending: end }));
  }, [selectedData]);

  return (
  

          
       <HighchartsReact
            
            ref={chartComponent}
            containerProps={{ style:{ height: "93vh" } }}
            highcharts={Highcharts}
            constructorType={"stockChart"}
            // immutable={true}
            options={options}
          />
     
          
  
  );
}
