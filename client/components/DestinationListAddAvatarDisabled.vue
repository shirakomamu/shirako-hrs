<template>
  <div
    class="
      relative
      flex flex-col
      items-center
      text-center
      p-2
      transition
      bg-white bg-opacity-50
      hover:bg-opacity-70
      dark:(bg-opacity-5
      hover:bg-opacity-10)
    "
  >
    <IconsPlaylistAdd class="list-icon opacity-50 h-6 w-6" />
    <div class="grid grid-cols-1 gap-2 place-items-center my-8 w-full">
      <IconsError class="icon-inline h-12 w-12 text-red-500" />
      <p class="text-sm">Verify email to create lists</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DestinationListAddAvatarDisabled",
});
</script>

<style lang="less" scoped>
.list-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>
