export function ymd(date:number){
    return new Date(date).toISOString().slice(0, 10)
  }

  export function filterDefaultCategories(){
    return ["HK market","US market"]
  }