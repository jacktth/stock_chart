import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectSymbol } from "./chartSlice";

export function Chart() {
  const symbol = useAppSelector(selectSymbol);
  const dispatch = useAppDispatch();
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
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={options}
      />
    </div>
  );
}
