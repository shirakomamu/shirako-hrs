<template>
  <div
    class="
      relative
      grid grid-cols-1
      items-center
      text-center
      p-4
      h-full
      transition
      bg-white/50
      hover:bg-white/70
      dark:(bg-white/5
      hover:bg-white/10)
    "
  >
    <div class="grid grid-cols-1 gap-2 place-items-center">
      <IconsAdd class="icon-inline h-12 w-12" />
      <p>Add to list</p>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DestinationItemAddAvatar",
});
</script>

<style lang="less" scoped></style>
