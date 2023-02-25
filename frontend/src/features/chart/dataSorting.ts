import { HistoricalRowHistory } from "yahoo-finance2/dist/esm/src/modules/historical";

export default function(arr:HistoricalRowHistory[]){
    let sortedArray:number[][] = []
    arr.forEach((obj:HistoricalRowHistory)=>{sortedArray.push([new Date(obj.date).getTime(),obj.open,obj.high,obj.low,obj.close])})
    return sortedArray
}