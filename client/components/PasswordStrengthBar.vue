<template>
  <div class="grid grid-cols-4 gap-1 w-full">
    <div class="bar bar-1" :class="{ active: strength >= 1 }" />
    <div class="bar bar-2" :class="{ active: strength >= 2 }" />
    <div class="bar bar-3" :class="{ active: strength >= 3 }" />
    <div class="bar bar-4" :class="{ active: strength >= 4 }" />
    <!-- <div class="text-xs col-span-4 opacity-50">{{ passwordText }}</div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "PasswordStrengthBar",
  props: {
    strength: {
      type: Number,
      default: () => 0,
    },
  },
});
</script>

<style lang="less" scoped>
.bar {
  height: 0.3rem;
  transition: background-color 0.2s ease, opacity 0.2s ease;

  &:not(.active) {
    opacity: 0.1;
    background-color: black;

    @media (prefers-color-scheme: dark) {
      background-color: white;
    }
  }

  &.active {
    &.bar-1 {
      background-color: maroon;
    }
    &.bar-2 {
      background-color: orange;
    }
    &.bar-3 {
      background-color: greenyellow;
    }
    &.bar-4 {
      background-color: #008aff;
    }
  }
}
</style>
