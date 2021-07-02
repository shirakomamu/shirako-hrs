<template>
  <div class="space-y-8">
    <h5>Home</h5>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Index",
  setup() {
    const context = useContext();
    useMeta({ title: "Home | " + context.$config.appinfo.name });
  },
  head: {},
});
</script>

<style lang="less" scoped></style>
