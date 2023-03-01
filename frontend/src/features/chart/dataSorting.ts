import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";

export default function (arr: HistoricalRowHistory[]) {
  const stockData: number[][] = [];
  const date: number[] = [];

  arr.forEach((obj: HistoricalRowHistory) => {
    stockData.push([
      new Date(obj.date).getTime(),
      obj.open,
      obj.high,
      obj.low,
      obj.close,
    ]);
    date.push(new Date(obj.date).getTime());
  });
  return { stockData: stockData, date: date };
}
//
