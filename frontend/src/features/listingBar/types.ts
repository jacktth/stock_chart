import { Database } from "../../api/types/supabase";

export type ListingData = {

        symbol: string;
        engName: string;
        zhNAme?: string;
        market:string
 

};



export type CategoriesQueryData = Database["public"]["Tables"]["categories"]["Row"]