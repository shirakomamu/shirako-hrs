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
      bg-white bg-opacity-50
      dark:(bg-opacity-5
      hover:bg-opacity-10) hover:bg-opacity-70
    "
  >
    <p>
      <IconsError class="icon-inline text-red-500" />
      <span class="text-sm">Verify email to share list</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "DestinationUserAddAvatarDisabled",
  setup() {},
});
</script>

<style lang="less" scoped></style>
