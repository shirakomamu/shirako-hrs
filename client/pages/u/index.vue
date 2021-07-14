<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  asyncData({ error }) {
    error({
      statusCode: 404,
    });
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped></style>
