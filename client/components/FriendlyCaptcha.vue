<template>
  <div>
    <div class="frc-captcha" :data-sitekey="sitekey" />
    <component
      :is="'script'"
      src="https://cdn.jsdelivr.net/npm/friendly-challenge@0.8.8/widget.module.min.js"
      async
      defer
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "FriendlyCaptcha",
  data() {
    return {
      sitekey: this.$config.fcSitekey as string,
    };
  },
});
</script>

<style lang="less" scoped></style>
