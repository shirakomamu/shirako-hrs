<template>
  <div class="notification-container">
    <div class="bg-gray-700"><p>Test</p></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "AppNotification",
  setup() {},
});
</script>

<style lang="less" scoped>
.direct-container {
  position: fixed;
}
</style>
