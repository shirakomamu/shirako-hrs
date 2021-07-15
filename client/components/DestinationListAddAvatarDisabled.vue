<template>
  <div
    class="
      container
      grid grid-cols-1
      items-center
      text-center
      border border-black
      dark:border-white
      border-opacity-50
      hover:border-opacity-100
      border-dashed
      p-2
      transition
    "
  >
    <PlaylistAdd class="list-icon opacity-50" />
    <div class="grid grid-cols-1 gap-2 place-items-center">
      <Error class="icon-inline text-red-500" />
      <p class="text-sm">Email verification required</p>
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
  aspect-ratio: 1 / 1;
  position: relative;
}
.list-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  height: 1.5rem;
  width: 1.5rem;
}
.icon-inline {
  width: 3rem;
  height: 3rem;
}
</style>
