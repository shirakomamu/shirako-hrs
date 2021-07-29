<template>
  <div
    class="
      container
      flex flex-col
      items-center
      text-center
      p-2
      transition
      bg-white/50
      hover:bg-white/70
      dark:(bg-white/5
      hover:bg-white/10)
      h-full
    "
  >
    <IconsList class="list-icon opacity-50" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DestinationListAvatar",
  setup() {},
});
</script>

<style lang="less" scoped>
.container {
  position: relative;
}
.list-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
}
</style>
