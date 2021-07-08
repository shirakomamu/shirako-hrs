<template>
  <nuxt-child />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    return {};
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped></style>
