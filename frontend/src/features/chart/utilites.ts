import dayjs from "dayjs";
import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";

export function dateDiff(start: number, end: number) {
  if(start === 0 && end===0) return ""
  const date1 = dayjs(new Date(start).toISOString().slice(0, 10));
  const date2 = dayjs(new Date(end).toISOString().slice(0, 10));
  return date2.diff(date1, "d", true) + 1;
}

export  function stockPriceDataSorting (arr: HistoricalRowHistory[]) {
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

export function ymd(date:number){
  return new Date(date).toISOString().slice(0, 10)
}