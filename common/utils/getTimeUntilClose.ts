import { utcToZonedTime } from "date-fns-tz";

const timeStringToMinutes = (time: string) => {
  return 60 * Number(time.slice(0, 2)) + Number(time.slice(2));
};

// negative: minutes until open
// positive: minutes until close
// null: is closed now and not open tomorrow either
const getTimeUntilClose = (
  ts: number,
  hours: {
    is_overnight: boolean;
    start: string; // 0000
    end: string; // 0000
    day: number; // 0-6 (Mon - Sun)
  }[],
  timezone: string
) => {
  const nowInTz = utcToZonedTime(ts, timezone);
  const day = nowInTz.getDay();

  const dayBefore = hours.filter(
    (e) => e.day === (day + 6) % 7 && e.is_overnight
  );
  const dayOf = hours.filter((e) => e.day === day);
  const dayAfter = hours.filter((e) => e.day === (day + 1) % 7);

  // check if it's still open
  if (dayOf.length) {
    for (const day of dayOf) {
      const dayOfTime = {
        start: timeStringToMinutes(day.start),
        end: timeStringToMinutes(day.end),
      };
      // console.log("Case 1", day.day, day.start, day.end);

      const nowTime = nowInTz.getHours() * 60 + nowInTz.getMinutes();
      if (nowTime >= dayOfTime.start && nowTime <= dayOfTime.end) {
        const minsRemaining = dayOfTime.end - nowTime;

        // console.log(
        //   "Case 1, returning",
        //   minsRemaining,
        //   "with nowTime",
        //   nowTime
        // );
        return minsRemaining;
      }
    }
  }

  if (dayBefore.length) {
    for (const day of dayBefore) {
      const dayBeforeTime = {
        start: timeStringToMinutes(day.start),
        end: timeStringToMinutes(day.end),
      };
      // console.log("Case 2", day.day, day.start, day.end);

      const nowTime = nowInTz.getHours() * 60 + nowInTz.getMinutes();
      if (nowTime <= dayBeforeTime.end) {
        const minsRemaining = dayBeforeTime.end - nowTime;

        // console.log(
        //   "Case 2, returning",
        //   minsRemaining,
        //   "with nowTime",
        //   nowTime
        // );
        return minsRemaining;
      }
    }
  }

  // check time until open
  if (dayOf.length) {
    for (const day of dayOf) {
      const dayOfTime = {
        start: timeStringToMinutes(day.start),
        end: timeStringToMinutes(day.end),
      };
      // console.log("Case 3", day.day, day.start, day.end);

      const nowTime = nowInTz.getHours() * 60 + nowInTz.getMinutes();
      if (nowTime <= dayOfTime.start) {
        const minsRemaining = dayOfTime.start - nowTime;

        // console.log(
        //   "Case 3, returning",
        //   minsRemaining,
        //   "with nowTime",
        //   nowTime
        // );
        return -1 * minsRemaining;
      }
    }
  }

  if (dayAfter.length) {
    const day = dayAfter.sort((a, b) =>
      (a.start || "").localeCompare(b.start)
    )[0];
    const dayAfterTime = {
      start: timeStringToMinutes(day.start),
      end: timeStringToMinutes(day.end),
    };
    // console.log("Case 4", day.day, day.start, day.end);

    const nowTime = nowInTz.getHours() * 60 + nowInTz.getMinutes();
    const minsRemaining = dayAfterTime.start + (24 * 60 - nowTime);

    // console.log("Case 4, returning", minsRemaining, "with nowTime", nowTime);
    return -1 * minsRemaining;
  }

  return null;
};

export default getTimeUntilClose;
