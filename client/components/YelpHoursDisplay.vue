<template>
  <div class="flex flex-row gap-2">
    <div class="flex-shrink-0">
      <p v-for="(time, index) in weekdayMap" :key="'day-' + index">
        {{ time.day }}
      </p>
    </div>
    <div class="flex-shrink-0">
      <p v-for="(time, index) in weekdayMap" :key="'time-' + index">
        {{ time.hours }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "YelpHoursDisplay",
  props: {
    hours: {
      type: Array as PropType<
        {
          day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
          start: string;
          end: string;
          is_overnight: boolean;
        }[]
      >,
      required: true,
    },
  },
  setup(props) {
    const weekdayMapShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    // const weekdayMapLong = [
    //   "Sunday",
    //   "Monday",
    //   "Tuesday",
    //   "Wednesday",
    //   "Thursday",
    //   "Friday",
    //   "Saturday",
    // ];

    const weekdaysUsed = props.hours
      .map((e) => e.day)
      .filter((e, i, a) => a.indexOf(e) === i);

    const weekdayMap = weekdaysUsed.map((e) => ({
      day: weekdayMapShort[e],
      hours: props.hours
        .filter((f) => f.day === e)
        .map(
          (time) => `${time.start.slice(0, 2) + ":" + time.start.slice(2)} ~
        ${time.end.slice(0, 2) + ":" + time.end.slice(2)}`
        )
        .join(" / "),
    }));

    return { weekdayMap };
  },
});
</script>

<style lang="less" scoped></style>
