import { Injectable } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { HistoricalHistoryResult } from 'yahoo-finance2/dist/esm/src/modules/historical';
import { getDataBody } from './stock-data.controller';

@Injectable()
export class StockDataService {
    async getStockData(getDataBody): Promise<HistoricalHistoryResult> {
        // console.log("this",getDataBody," ",Date.now())
        const query = getDataBody.symbol;
        const queryOptions = { period1: getDataBody.period1, period2:getDataBody.period2/* ... */ };
        const result = await yahooFinance.historical(query, queryOptions);
        return result;
      }
}
