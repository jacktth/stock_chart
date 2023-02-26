import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as XLSX from 'xlsx';
@Injectable()
export class ListingService {
  private readonly logger = new Logger(ListingService.name);
  constructor(private readonly httpService: HttpService) {}
  async getList() {
    const usListingData = async () => {
      const usListingURL =
        'https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true';
        const res = await firstValueFrom(
          this.httpService
            .get(usListingURL)
            .pipe(
              catchError((error: AxiosError) => {
                this.logger.error(error.response.data);
                throw 'An error happened!';
              }),
            ),
        );

        const row = res.data.data.rows
        const dataContainer = []
        for(let obj of row){
          dataContainer.push({"symbol":obj.symbol,"engName":obj.name})
        }
        return dataContainer
    };
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
        });

        n++;
      }
      return dataContainer;
    };
   
    return {us:await usListingData(),hk:await hkListingData()}
  }
}
