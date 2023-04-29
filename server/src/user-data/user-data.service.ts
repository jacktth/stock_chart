import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Supabase } from 'src/api/supabase';
import { Categories, Clip, ClipQueryParams, ClipResult } from './types/types';
import yahooFinance from 'yahoo-finance2';
import { hkQuery } from 'src/stock-data/utilies';
import { error, log } from 'console';
import { response } from 'express';
import { filterDefaultCategories, ymd } from './utilies';

@Injectable()
export class UserDataService {
  constructor(private readonly supabase: Supabase) {}

  async findAllClips(query: ClipQueryParams) {
    const { data: apiUserData, error: apiUserDataError } = await this.supabase
      .getClient()
      .from('apikeys')
      .select()
      .eq('api_key', query.apikey);
    console.log('findAllClips', query, ' ', apiUserDataError);

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
          });
        } catch (error) {
          throw error;
        }
      }

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
    const { data, error } = await this.supabase
      .getClient()
      .from('apikeys')
      .select()
      .eq('api_key', apiKey);
    if (!!error) {
      return error;
    } else {
      const userId = data[0].user_id;
      const { data: categoriesQueryData, error } = await this.supabase
        .getClient()
        .from('categories')
        .select()
        .eq('user_id', userId);
      const categories: Categories = [];
      categoriesQueryData.forEach((data) => {
        if (filterDefaultCategories().includes(data.name) === false) {
          categories.push(data.name);
        }
      });
      return categories;
    }
  }
}
