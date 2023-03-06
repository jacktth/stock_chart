import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

// Define a type for the slice state
interface listState {
  categories: string[];
  clip: Clip[];
}

type Clip = 
  {
    symbol: string;
    starting: number;
    ending: number;
  }
;

export type ResponseCategoriesArray = [{
    id:number
    created_at:string
    name:string
}]

export type ResponseClipArray = {
    id:number
    created_at:string
    symbol:string
    starting:number
    ending: number;
    list:string
    user_id:string

}

// Define the initial state using that type
const initialState: listState = {
  categories: [],
  clip: [],
};

export const listSlice = createSlice({
  name: "list",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initClip: (state, action: PayloadAction<ResponseClipArray[]>) => {
        let obj = state
        action.payload.forEach((el:ResponseClipArray)=>{
            obj = {...obj,clip:[...obj.clip,{symbol:el.symbol,starting:el.starting,ending:el.ending}]}
        })
        return obj;
      },
    initCategories: (state, action: PayloadAction<ResponseCategoriesArray>) => {
        let obj = state
        action.payload.forEach((el)=>{
            obj = {...obj,categories:[...state.categories,el.name]}
        })
        return obj;
      },
    addCategories: (state, action: PayloadAction<string>) => {
      return { ...state, categories: [...state.categories, action.payload] };
    },
    removeCategories: (state, action: PayloadAction<string>) => {
        const newCategories = [...state.categories].filter((c)=> c!== action.payload)
        return { ...state, categories: newCategories };
      },
    addClip: (state, action: PayloadAction<Clip>) => {
      return {...state, state:[...state.clip,action.payload]}
    },
  },
});

export const { addCategories, removeCategories,addClip,initCategories,initClip } = listSlice.actions;


// Other code such as selectors can use the imported `RootState` type
export const selectClip = (state: RootState) => state.list.clip;
export const selectCategories = (state: RootState) => state.list.categories;

export default listSlice.reducer;
