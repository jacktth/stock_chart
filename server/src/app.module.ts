import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockDataController } from './stock-data/stock-data.controller';
import { StockDataService } from './stock-data/stock-data.service';

@Module({
  imports: [],
  controllers: [AppController, StockDataController],
  providers: [AppService, StockDataService],
})
export class AppModule {}
