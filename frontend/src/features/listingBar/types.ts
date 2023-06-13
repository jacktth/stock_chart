import { Database } from "../../api/types/supabase";

export type ListingData = {

        symbol: string;
        engName: string;
        zhName?: string;
        market:string
 

};



export type CategoriesQueryData = Database["public"]["Tables"]["categories"]["Row"]

export type CategoriesMutationResponse = {
        success:string
        fail:string
}
