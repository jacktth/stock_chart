import dayjs from "dayjs";

export function dateDiff(start: number, end: number) {
  if(start === 0 && end===0) return ""
  const date1 = dayjs(new Date(start).toISOString().slice(0, 10));
  const date2 = dayjs(new Date(end).toISOString().slice(0, 10));
  return date2.diff(date1, "d", true) + 1;
}

export function ymd(date:number){
  return new Date(date).toISOString().slice(0, 10)
}