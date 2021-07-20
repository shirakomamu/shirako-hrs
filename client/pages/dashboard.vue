<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">Dashboard</h5>
  </div>
</template>

<script lang="ts">
import { Role } from "common/enums/hrbac";
import { Guard } from "common/types/hrbac";
import { defineComponent, useContext, useMeta } from "@nuxtjs/composition-api";

export default defineComponent({
  meta: {
    guard: {
      roles: [Role._self_destination_lists],
    } as Guard,
  },
  setup() {
    const context = useContext();
    useMeta({ title: "Dashboard | " + context.$config.appinfo.name });

    return {};
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped></style>
