<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  asyncData({ error }) {
    error({
      statusCode: 404,
      message: "This page could not be found.",
      // path: route.path,
    });
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped></style>
