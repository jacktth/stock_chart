import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
import { getListingParam } from './listing.controller';
import { AllListings, UsStockListData } from './types';
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
          this.httpService.get<UsStockListData>(usListingURL).pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error);
              throw 'An error happened!';
            }),
          ),
        );
  
        const row:UsStockListData = resUs.data;
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
        const hkListingURL =
          'https://www2.hkexnews.hk/-/media/HKEXnews/Homepage/Others/Quick-Link/Homepage/Other-Useful-Information/Hyperlinks-to-Listed-Co.xlsx';
        const res = await firstValueFrom(
          this.httpService
            .get(hkListingURL, { responseType: 'arraybuffer' })
            .pipe(
              catchError((error: AxiosError) => {
                this.logger.error(error.response.data);
                throw 'An error happened!';
              }),
            ),
        );
        const wb = XLSX.read(res.data);
        const ws = wb.Sheets[wb.SheetNames[0]];
        let beginRow = 1;
        const dataContainer = [];
        //+ 1 is to ensure the max number of row is correct
        const targetLength = XLSX.utils.decode_range(ws['!ref']).e.r + 1;
        while (beginRow <= targetLength) {
          if (ws[`A${beginRow}`] !== undefined) {
            if (ws[`A${beginRow}`]['v'] === 1) break;
          }
          beginRow++;
        }
        let n = beginRow;
        while (n <= targetLength) {
          dataContainer.push({
            symbol: ws[`A${n}`]['v'],
            engName: ws[`B${n}`]['v'],
            zhName: ws[`C${n}`]['v'],
            market: 'HK',
          });

          n++;
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
        this.httpService.get<UsStockListData>(usListingURL).pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw 'An error happened!';
          }),
        ),
      );

      const row:UsStockListData = resUs.data;
      
      const dataContainer: AllListings[] = [];

      for (let obj of row) {
        new String(obj.symbol).includes('^')
          ? null
          : dataContainer.push({
              symbol: obj.symbol.trim(),
              engName: usStockNameFilter(obj.name),
              market: 'US',
            });
      }

      const hkListingURL =
        'https://www2.hkexnews.hk/-/media/HKEXnews/Homepage/Others/Quick-Link/Homepage/Other-Useful-Information/Hyperlinks-to-Listed-Co.xlsx';
      const resHk = await firstValueFrom(
        this.httpService
          .get(hkListingURL, { responseType: 'arraybuffer' })
          .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
          ),
      );
      const wb = XLSX.read(resHk.data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      let beginRow = 1;
      //+ 1 is to ensure the max number of row is correct
      const targetLength = XLSX.utils.decode_range(ws['!ref']).e.r + 1;
      while (beginRow <= targetLength) {
        if (ws[`A${beginRow}`] !== undefined) {
          if (ws[`A${beginRow}`]['v'] === 1) break;
        }
        beginRow++;
      }
      let n = beginRow;
      while (n <= targetLength) {
        dataContainer.push({
          symbol: ws[`A${n}`]['v'],
          engName: ws[`B${n}`]['v'],
          zhName: ws[`C${n}`]['v'],
          market: 'HK',
        });

        n++;
      }

      return dataContainer;
    };

    return await allListData();
  }
}
