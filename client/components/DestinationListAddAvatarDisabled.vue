<template>
  <div
    class="
      container
      flex flex-col
      items-center
      text-center
      p-2
      transition
      bg-white bg-opacity-50
      dark:bg-opacity-5
      hover:bg-opacity-70
      dark:hover:bg-opacity-10
    "
  >
    <PlaylistAdd class="list-icon opacity-50 h-6 w-6" />
    <div class="grid grid-cols-1 gap-2 place-items-center my-8 w-full">
      <Error class="icon-inline h-12 w-12 text-red-500" />
      <p class="text-sm">Verify email to create lists</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Error from "client/components/icons/Error.vue";
import PlaylistAdd from "client/components/icons/PlaylistAdd.vue";

export default defineComponent({
  name: "DestinationListAddAvatarDisabled",
  components: {
    Error,
    PlaylistAdd,
  },
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
}
</style>
