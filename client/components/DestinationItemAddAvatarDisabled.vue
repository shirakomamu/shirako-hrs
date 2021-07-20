<template>
  <div
    class="
      container
      grid grid-cols-1
      items-center
      text-center
      p-4
      h-full
      transition
      bg-white bg-opacity-50
      dark:bg-opacity-5
    "
  >
    <div class="grid grid-cols-1 gap-2 place-items-center">
      <Error class="icon-inline text-red-500" />
      <p class="text-sm">Verify email to add to list</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Error from "client/components/icons/Error.vue";

export default defineComponent({
  name: "DestinationItemAddAvatarDisabled",
  components: {
    Error,
  },
});
</script>

<style lang="less" scoped>
.container {
  position: relative;
}
.icon-inline {
  width: 3rem;
  height: 3rem;
}
</style>
