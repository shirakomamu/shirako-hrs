<template>
  <div class="manage-account space-y-8">
    <h5>Manage account</h5>
    <div class="grid grid-cols-1 md:grid-cols-2 grid-flow-row">
      <div class="grid col-span-2 md:col-span-1 place-items-center"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {};
  },
  head() {
    return {
      title: "Manage account | " + this.$config.appinfo.name,
    };
  },
});
</script>

<style lang="less" scoped></style>
