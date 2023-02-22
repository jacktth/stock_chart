import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockDataController } from './stock-data/stock-data.controller';
import { StockDataService } from './stock-data/stock-data.service';
import { ListingController } from './listing/listing.controller';
import { ListingService } from './listing/listing.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AppController, StockDataController, ListingController],
  providers: [AppService, StockDataService, ListingService],
})
export class AppModule {}
