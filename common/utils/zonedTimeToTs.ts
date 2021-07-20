import { zonedTimeToUtc } from "date-fns-tz";

const zonedTimeToTs = (date: string | number | Date, tz: string) => {
  return zonedTimeToUtc(date, tz).getTime();
};

export default zonedTimeToTs;
