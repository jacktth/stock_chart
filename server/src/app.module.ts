import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StockDataController } from './stock-data/stock-data.controller';
import { StockDataService } from './stock-data/stock-data.service';
import { ListingController } from './listing/listing.controller';
import { ListingService } from './listing/listing.service';
import { HttpModule } from '@nestjs/axios';
import { UserDataModule } from './user-data/user-data.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './api/supabase.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [HttpModule, UserDataModule,ConfigModule.forRoot(), PassportModule, SupabaseModule],
  controllers: [AppController, StockDataController, ListingController,],
  providers: [AppService, StockDataService, ListingService],
})
export class AppModule {}
