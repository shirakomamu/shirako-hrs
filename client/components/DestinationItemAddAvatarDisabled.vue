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
      dark:bg-white/5
    "
  >
    <div class="grid grid-cols-1 gap-2 place-items-center">
      <IconsError class="icon-inline text-red-500 h-12 w-12" />
      <p class="text-sm">Verify email to add to list</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DestinationItemAddAvatarDisabled",
});
</script>

<style lang="less" scoped></style>
