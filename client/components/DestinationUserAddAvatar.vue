<template>
  <div
    class="
      p-4
      sm:(py-2
      px-4)
      h-full
      grid grid-cols-1
      place-items-center
      transition
      bg-white/50
      hover:bg-white/70
      dark:(bg-white/5
      hover:bg-white/10)
    "
  >
    <p><IconsPersonAdd class="icon-inline" /> Share</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DestinationUserAddAvatar",
  setup() {},
});
</script>

<style lang="less" scoped></style>
