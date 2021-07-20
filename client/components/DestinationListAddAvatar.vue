<template>
  <div
    class="
      container
      grid grid-cols-1
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
    <PlaylistAdd class="list-icon opacity-50" />
    <div class="grid grid-cols-1 gap-2 place-items-center">
      <Add class="icon-inline" />
      <p>Create list...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import Add from "client/components/icons/Add.vue";
import PlaylistAdd from "client/components/icons/PlaylistAdd.vue";

export default defineComponent({
  name: "DestinationListAddAvatar",
  components: {
    Add,
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
