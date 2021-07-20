<template>
  <img ref="image" class="image-fader" @load="onLoad" />
</template>

<script lang="ts">
import { defineComponent, ref } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "ImageFader",
  setup() {
    const image = ref<null | HTMLImageElement>(null);
    const onLoad = () => {
      image.value?.classList.add("loaded");
    };

    return { image, onLoad };
  },
});
</script>

<style lang="less" scoped>
.image-fader {
  opacity: 0;
  transition: opacity 0.2s ease;
  &.loaded {
    opacity: 1;
  }
}
</style>
