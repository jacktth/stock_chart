export function ymd(date:number){
    return new Date(date).toISOString().slice(0, 10)
  }