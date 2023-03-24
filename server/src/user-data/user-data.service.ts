import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Supabase } from 'src/api/supabase';
import { CreateUserDatumDto } from './dto/create-user-datum.dto';
import { UpdateUserDatumDto } from './dto/update-user-datum.dto';
import { Categories, Clip, ClipQueryParams, ClipResult } from './types/types';
import yahooFinance from 'yahoo-finance2';
import { hkQuery } from 'src/stock-data/utilies';
import { error } from 'console';
import { response } from 'express';
import { ymd } from './utilies';

@Injectable()
export class UserDataService {
  constructor(private readonly supabase: Supabase) {}
  create(createUserDatumDto: CreateUserDatumDto) {
    return 'This action adds a new userDatum';
  }

  async findAllClips(query: ClipQueryParams) {
    const { data: apiUserData, error: apiUserDataError } = await this.supabase
      .getClient()
      .from('apikeys')
      .select()
      .eq('api_key', query.apikey);

    if (apiUserDataError) return apiUserDataError;
    if (apiUserData.length === 0)
      throw new BadRequestException(
        'Possibly wrong Api key, please ensure input the correct Api key',
      );

    const userId = apiUserData[0].user_id;
    const clipsContainer: ClipResult = [];

    if (query.categories === undefined || query.categories.length === 0) {
      const { data: categoriesQueryData, error: categoriesQueryError } =
        await this.supabase
          .getClient()
          .from('categories')
          .select()
          .eq('user_id', userId);
      const categoriesContainer = [];
      categoriesQueryData.forEach((el) => {
        if (!el.default) categoriesContainer.push(el);
      });
      const { data: clipsData, error: clipsDataError } = await this.supabase
        .getClient()
        .from('clip')
        .select()
        .eq('user_id', userId);

      for (const clip of clipsData) {
        const queryOptions = {
          period1: ymd(clip.starting),
          period2: ymd(clip.ending) /* ... */,
        };
        const symbol =
          clip.market === 'HK' ? hkQuery(clip.symbol) : clip.symbol;
        const category = clip.category;
        try {
          await yahooFinance.historical(symbol, queryOptions).then((data) => {
            clipsContainer.push({
              symbol: symbol,
              category: category,
              date: { from: ymd(clip.starting), to: ymd(clip.ending) },
              data: data,
            });

            console.log('data', clipsContainer.length);
          });
        } catch (error) {
          throw error;
        }
      }

      console.log('data', clipsContainer.length);

      return clipsContainer;
    } else if (query.categories.length > 0) {
      const { data: clipsData, error: clipsDataError } = await this.supabase
        .getClient()
        .from('clip')
        .select()
        .eq('user_id', userId);
      for await (const clip of clipsData) {
        if (query.categories.includes(clip.category)) {
          const queryOptions = {
            period1: ymd(clip.starting),
            period2: ymd(clip.ending) /* ... */,
          };
          const symbol =
            clip.market === 'HK' ? hkQuery(clip.symbol) : clip.symbol;
          const category = clip.category;
          try {
            await yahooFinance.historical(symbol, queryOptions).then((data) => {
              clipsContainer.push({
                symbol: symbol,
                category: category,
                date: { from: ymd(clip.starting), to: ymd(clip.ending) },
                data: data,
              });

              console.log('data', clipsContainer.length);
            });
          } catch (error) {
            throw error;
          }
        }
      }

      return clipsContainer;
    }
    return 'no';
  }
  async findAllCategories(apiKey: string) {
    console.log(apiKey, '1');

    const { data, error } = await this.supabase
      .getClient()
      .from('apikeys')
      .select()
      .eq('api_key', apiKey);
    if (!!error) {
      return error;
    } else {
      console.log(data);

      const userId = data[0].user_id;
      const { data: categoriesQueryData, error } = await this.supabase
        .getClient()
        .from('categories')
        .select()
        .eq('user_id', userId);
      const categories: Categories = [];
      categoriesQueryData.forEach((data) => {
        categories.push(data.name);
      });
      return categories;
    }
  }
}
