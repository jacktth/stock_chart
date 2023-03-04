import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { HistoricalHistoryResult } from 'yahoo-finance2/dist/esm/src/modules/historical';
import { getDataParam } from './stock-data.controller';

@Injectable()
export class StockDataService {
  async getStockData(
    getDataParam: getDataParam,
  ): Promise<HistoricalHistoryResult> {
    const queryOptions = {
      period1: getDataParam.period1,
      period2: getDataParam.period2 /* ... */,
    };
    console.log("this",getDataParam," ",Date.now())

    switch (getDataParam.market) {
      case 'HK':
        const hkQuery = (getDataBody:getDataParam) =>{
          const diff = 4 - +(getDataBody.symbol.length) 
          return  "0".repeat(diff) + getDataBody.symbol + "." + getDataBody.market
        }
        
        return await yahooFinance.historical(hkQuery(getDataParam), queryOptions);
      case 'US':
        const query = getDataParam.symbol;

        return await yahooFinance.historical(query, queryOptions);
    }
  }
}
