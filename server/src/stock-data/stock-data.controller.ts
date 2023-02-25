import { Body, Controller, Get, Header, Param, Post } from '@nestjs/common';
import yahooFinance from 'yahoo-finance2';
import { StockDataService } from './stock-data.service';

export class getDataBody{
    symbol:string
    market:string
    period1:string
    period2?:string

}

@Controller()
export class StockDataController {
  constructor(private readonly stockDataService: StockDataService) {}

  @Post('stock-data')
   getStockData(@Body()getDataBody:getDataBody) {
    return this.stockDataService.getStockData(getDataBody);
  }
}
