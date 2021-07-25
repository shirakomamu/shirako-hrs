<template>
  <div class="container flex flex-col items-center text-center p-2 transition">
    <div class="grid grid-cols-1 gap-2 place-items-center my-8 w-full">
      <PlaylistAdd class="icon-inline h-8 w-8" />
      <p>Create list</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";
import PlaylistAdd from "client/components/icons/PlaylistAdd.vue";

export default defineComponent({
  name: "DestinationListAddAvatar",
  components: {
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
