import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { getListingParam } from './listing.controller';
import { AllListings, HkStockListInfo, UsStockListInfo } from './types';
import { usStockNameFilter } from './utilies';



@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);
  constructor(private readonly httpService: HttpService) {}
  
  async getList(param: getListingParam) {

    if (param.market === 'US market') {

      const usListingData = async () => {
        // const usListingURL =
        //   'https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true';
        const usListingURL =
        'https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/nasdaq/nasdaq_full_tickers.json';
        const resUs  = await firstValueFrom(
          this.httpService.get<UsStockListInfo>(usListingURL).pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw 'An error happened!';
            }),
          ),
        );
  
        const row:UsStockListInfo = resUs.data;
        const dataContainer = [];
        for (let obj of row) {
          new String(obj.symbol).includes('^')
            ? null
            : dataContainer.push({
                symbol: obj.symbol,
                engName: usStockNameFilter(obj.name),
                market: 'US',
              });
        }
        return dataContainer;
      };
      return await usListingData();
    } else if (param.market === 'HK market') {

      const hkListingData = async () => {
        const hkListingInfoJsonUrl = `https://raw.githubusercontent.com/jacktth/ga-hk_stock_info/main/stock_info/data.json`
        const resHk  = await firstValueFrom(
          this.httpService.get<HkStockListInfo[]>(hkListingInfoJsonUrl).pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw 'Failed to get hk listing info';
            }),
          ),
        );
        const row = resHk.data;
          const dataContainer = [];
          for (let obj of row) {
            dataContainer.push({
                  symbol: obj.symbol,
                  engName: obj.engName,
                  zhName:obj.zhName,
                  market: 'HK',
                });
          }
          return dataContainer;
      
      };
      return await hkListingData();
    }
  }

  async getAllLists() {
    const allListData = async () => {
      const usListingURL =
        'https://raw.githubusercontent.com/rreichel3/US-Stock-Symbols/main/nasdaq/nasdaq_full_tickers.json';
      const resUs  = await firstValueFrom(
        this.httpService.get<UsStockListInfo>(usListingURL).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw 'An error happened!';
          }),
        ),
      );

      const UsJsonArray:UsStockListInfo = resUs.data;
      
      const dataContainer: AllListings[] = [];

      for (let obj of UsJsonArray) {
        new String(obj.symbol).includes('^')
          ? null
          : dataContainer.push({
              symbol: obj.symbol.trim(),
              engName: usStockNameFilter(obj.name),
              market: 'US',
            });
      }
      const hkListingInfoJsonUrl = `https://raw.githubusercontent.com/jacktth/ga-hk_stock_info/main/stock_info/data.json`
      const resHk  = await firstValueFrom(
        this.httpService.get<HkStockListInfo[]>(hkListingInfoJsonUrl).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw 'Failed to get hk listing info';
          }),
        ),
      );
      const hkJsonArray = resHk.data;
        for (let obj of hkJsonArray) {
          dataContainer.push({
                symbol: obj.symbol,
                engName: obj.engName,
                zhName:obj.zhName,
                market: 'HK',
              });
        }
        return dataContainer;
    
    };

    return await allListData();
  }
}
