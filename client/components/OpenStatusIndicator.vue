<template>
  <div
    class="py-1 px-2 uppercase w-max text-xs font-semibold text-white"
    :class="classAdder"
  >
    <IconsSchedule class="icon-inline" />
    {{ displayText }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "@nuxtjs/composition-api";
import timeAgo from "common/utils/timeAgo";
import { FormatStyle } from "javascript-time-ago/style";

export default defineComponent({
  name: "OpenStatusIndicator",
  props: {
    timeUntilClose: {
      type: Number,
      default: null,
    },
    textOverride: {
      type: String,
      default: null,
    },
    classAdderOverride: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  setup(props) {
    const shortOptions = {
      labels: "short",
      steps: [
        { formatAs: "minute" },
        { minTime: 2 * 60 * 60, formatAs: "hour" },
      ],
    } as FormatStyle; // types definitions are behind...
    const displayText = computed(() => {
      if (props.textOverride) {
        return props.textOverride;
      }

      if (props.timeUntilClose === null || props.timeUntilClose === 0) {
        return "Closed";
      }

      if (props.timeUntilClose < -120) {
        return "Closed";
        // return (
        //   "Opening " +
        //   timeAgo.format(Date.now() - props.timeUntilClose * 60 * 1000, "mini")
        // );
      }

      if (props.timeUntilClose < 0) {
        return (
          "Opening " +
          timeAgo.format(
            Date.now() - props.timeUntilClose * 60 * 1000,
            shortOptions
          )
        );
      }

      if (props.timeUntilClose > 120) {
        return "Open";
      }

      if (props.timeUntilClose > 0) {
        return (
          "Closing " +
          timeAgo.format(
            Date.now() + props.timeUntilClose * 60 * 1000,
            shortOptions
          )
        );
      }

      return "Unknown";
    });

    const classAdder = computed(() => {
      if (props.classAdderOverride.length) {
        return props.classAdderOverride;
      }
      if (!props.timeUntilClose) {
        return ["bg-red-500"];
      }
      if (props.timeUntilClose < 0) {
        return ["bg-red-500"];
      }
      if (props.timeUntilClose > 120) {
        return ["bg-green-600"];
      }
      if (props.timeUntilClose > 0) {
        return ["bg-orange-srk"];
      }
      return ["bg-red-500"];
    });

    return { displayText, classAdder };
  },
});
</script>

<style lang="less" scoped></style>
