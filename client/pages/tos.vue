<template>
  <div class="terms-of-service space-y-8 max-w-prose">
    <h5 class="text-4xl dark:text-white">Terms of service</h5>
    <p>
      By using this site, you agree to the policy set forth below. Please note
      that these terms may change at any time without notice.
    </p>

    <h6 class="text-2xl font-semibold dark:text-white">Service continuity</h6>
    <p>
      This app is provided as a hobby, not as a commercial product. Services
      provided by this app may be stopped or modified at any time and without
      notice.
    </p>
    <p>
      Furthermore, this app is only provisioned with a minimal amount of
      capacity. You may face storage errors once this app's capacity limit has
      been reached. In order to ensure that this app can continue to be
      functional regardless,
      <strong
        >data stored within this service may be erased at any time and without
        notice</strong
      >.
    </p>
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
      title: "Terms of service | " + this.$config.appinfo.name,
    };
  },
});
</script>

<style lang="less" scoped></style>
