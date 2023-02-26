import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { HistoricalHistoryResult } from 'yahoo-finance2/dist/esm/src/modules/historical';
import { getDataBody } from './stock-data.controller';

@Injectable()
export class StockDataService {
  async getStockData(
    getDataBody: getDataBody,
  ): Promise<HistoricalHistoryResult> {
    console.log("this",getDataBody.symbol," ",Date.now())
    const queryOptions = {
      period1: getDataBody.period1,
      period2: getDataBody.period2 /* ... */,
    };
    switch (getDataBody.market) {
      case 'HK':
        const hkQuery = (getDataBody:getDataBody) =>{
          const diff = 4 - +(getDataBody.symbol.length) 
          return  "0".repeat(diff) + getDataBody.symbol + "." + getDataBody.market
        }
        
        return await yahooFinance.historical(hkQuery(getDataBody), queryOptions);
      case 'US':
        const query = getDataBody.symbol;
        return await yahooFinance.historical(query, queryOptions);
    }
  }
}
