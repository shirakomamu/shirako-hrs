<template>
  <button
    type="button"
    :alt="tabDisplayText"
    class="relative transition"
    :class="{
      'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 focus:bg-gray-400 dark:hover:bg-gray-500 dark:focus:bg-gray-500':
        !selected,
      'bg-gray-400 dark:bg-gray-500': selected,
    }"
    @click="onPick"
  >
    <div
      v-if="badgeNumber > 0"
      class="
        bg-red-500
        text-white
        rounded-full
        -top-1
        -right-1
        absolute
        text-xs
        font-bold
        h-2
        w-2
        p-0
      "
    />
    {{ tabDisplayText }}
  </button>
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "TabSelector",
  props: {
    tabId: {
      type: String,
      required: true,
    },
    tabName: {
      type: String,
      default: null,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    badgeNumber: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const tabDisplayText = ref<string>(props.tabName || props.tabId);

    const onPick = () => emit("pick", props.tabId);

    return { tabDisplayText, onPick };
  },
});
</script>

<style lang="less" scoped></style>
