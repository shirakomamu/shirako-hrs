<template>
  <div
    class="py-1 px-2 uppercase w-max text-xs font-semibold text-white"
    :class="classAdder"
  >
    <Schedule class="icon-inline" />
    {{ displayText }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@nuxtjs/composition-api";
import timeAgo from "common/utils/timeAgo";
import Schedule from "client/components/icons/Schedule.vue";

export default defineComponent({
  name: "OpenStatusIndicator",
  components: {
    Schedule,
  },
  props: {
    timeUntilClose: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const displayText = computed(() => {
      if (props.timeUntilClose === null || props.timeUntilClose === 0) {
        return "Closed";
      }

      if (props.timeUntilClose < 0) {
        return (
          "Opening " +
          timeAgo.format(Date.now() - props.timeUntilClose * 60 * 1000, "mini")
        );
      }

      if (props.timeUntilClose > 120) {
        return "Open";
      }

      if (props.timeUntilClose > 0) {
        return (
          "Closing " +
          timeAgo.format(Date.now() + props.timeUntilClose * 60 * 1000, "mini")
        );
      }

      return "Unknown";
    });

    const classAdder = computed(() => {
      if (!props.timeUntilClose) {
        return ["bg-red-500"];
      }
      if (props.timeUntilClose < 0) {
        return ["bg-red-500"];
      }
      if (props.timeUntilClose < 120) {
        return ["bg-orange-srk"];
      }
      if (props.timeUntilClose > 0) {
        return ["bg-green-600"];
      }
      return ["bg-red-500"];
    });

    return { displayText, classAdder };
  },
});
</script>

<style lang="less" scoped></style>
