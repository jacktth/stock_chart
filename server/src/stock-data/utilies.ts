import { getDataParam } from "./stock-data.controller"

export function hkQuery(hkSymbol:string){
    const diff = 4 - +(hkSymbol.length) 
    return  "0".repeat(diff) + hkSymbol + "." + "HK"
  }