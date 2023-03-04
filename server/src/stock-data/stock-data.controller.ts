import { Body, Controller, Get, Header, Param, Post } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import yahooFinance from 'yahoo-finance2';
import { StockDataService } from './stock-data.service';

export class getDataParam{
    symbol:string
    market:string
    period1:string
    period2?:string

}

@Controller()
export class StockDataController {
  constructor(private readonly stockDataService: StockDataService) {}

  @Get('stock-data')
   getStockData(@Query()param:getDataParam) {
    return this.stockDataService.getStockData(param);
  }
}
