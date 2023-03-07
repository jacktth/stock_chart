import Highcharts, { StockChart } from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  selectFocus,
  selectMarket,
  selectSymbol,
  updateFocus,
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
import { SaveBar } from "../saveBar/SaveBar";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addCategories,
  initCategories,
  initClip,
} from "../listingBar/listSlice";
import { useCategoriesQuery } from "../../hooks/useCategoriesQuery";
import { useUserQuery } from "../../hooks/useUserQuery";
import { getUserCategoriesQuery } from "../../api/queries/getUserCategoriesQuery";
import { getUserClipQuery } from "../../api/queries/getUserClipQuery";
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
  const { data } = useUserQuery();
  const chartComponent = useRef<HighchartsReact.RefObject>(null);

  const fetchStockData = () =>
    axios.get("http://localhost:3000/stock-data", {
      params: {
        symbol: globalSymbol,
        market: globalMarket,
        period1: "2022-02-01",
      },
    });
  useQuery(["stockData", globalSymbol, globalFocus], fetchStockData, {
    onSuccess(data) {
      setDateArray(dataSorting(data.data).date);
      setOptions({
        ...options,
        xAxis: {
          min: globalFocus.min,
          max: globalFocus.max,
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
        chart.xAxis[0].setExtremes(
          globalFocus.min ? globalFocus.min : undefined,
          globalFocus.max ? globalFocus.max : undefined
        );
      }
    },
  });
  const [symbol, setSymbol] = useState<string>(globalSymbol);
  const [dateArray, setDateArray] = useState<number[]>([]);
  const [error, setError] = useState<any>("no error");
  const [selectedData, setSelectedData] = useState<{
    start: number;
    end: number;
  }>({
    start: 0,
    end: 0,
  });
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
          //in this function, it is no use to use its setState hook to update the its state
          //because the setState won't update anything about itself
          const min = e.xAxis[0].min;
          const max = e.xAxis[0].max;
          setSelectedData({ start: min, end: max });

          return false; // returning false will disable the default zooming function while dragging on the chart
        },
        click: () => {
          setSelectedData({ start: 0, end: 0 });
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
    const max = selectedData.end;
    const min = selectedData.start;
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
  }, [selectedData]);
  //Need to use react query to improve
  useEffect(() => {
    console.log("data", data);
    if (data) {
      dispatch(
        updateAuth({
          id: data.id,
          createdAt: data.created_at,
          email: data.email ?data.email :"",
          lastSignInAt: data.last_sign_in_at? data.last_sign_in_at :"" ,
        })
      );
      
      getUserCategoriesQuery(supabase, data.id).then((data: {}) => {
        dispatch(initCategories(data["data"]));
      });
      getUserClipQuery(supabase, data.id).then((data: {}) => {
        dispatch(initClip(data["data"]));
      });
    }
  }, [data]);
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
          setDateArray(sortedData.date);
        },
        (error) => {
          setError(error);
        }
      );
    e.preventDefault();
  };

  const symbolOnChange = (e) => {
    dispatch(updateSymbol(e.target.value));
    e.preventDefault();
  };
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  return (
    <div className="view-full">
      <div className="flex view-full">
        <div className="SearchBar">
          <form className="w-full" onSubmit={handleSubmit}>
            <label>
              <input
                className="input"
                type="text"
                name="name"
                value={globalSymbol}
                onChange={symbolOnChange}
              />
            </label>
          </form>
          <button onClick={signOut}>log out</button>
          
          <ListingBar />
        </div>
        <div className="chartContainer">
          <SaveBar selectedData={selectedData} />
          {
            <HighchartsReact
              ref={chartComponent}
              containerProps={{ className: "h-screen" }}
              highcharts={Highcharts}
              constructorType={"stockChart"}
              // immutable={true}
              options={options}
            />
          }
        </div>
      </div>
    </div>
  );
}
