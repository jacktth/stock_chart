import { Database } from 'src/api/types/supabase';
import { HistoricalResult } from 'yahoo-finance2/dist/esm/src/modules/historical';

export type Categories =
  Database['public']['Tables']['categories']['Row']['name'][];
  export type Clip =
  Database['public']['Tables']['clip']['Row'];
export type ClipQueryParams = { apikey: string; categories?: string[] };

export type ClipResult = {symbol:string,date:{from:string,to:string},category:string,data:HistoricalResult}[]
