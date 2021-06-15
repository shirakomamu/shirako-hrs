<template>
  <div class="nav h-12 flex items-center">
    <div class="justify-start ml-8 flex flex-grow items-center">
      <div class="text-gray-500 text-sm">
        <span
          >© 2021
          <a
            href="https://shirako.dev/"
            target="_blank"
            class="hover:underline focus:underline"
            >白子マム</a
          ></span
        >
        |
        <nuxt-link
          to="/privacy"
          class="text-blue-500 hover:underline focus:underline"
          >privacy</nuxt-link
        >
        |
        <nuxt-link
          to="/tos"
          class="text-blue-500 hover:underline focus:underline"
          >terms</nuxt-link
        >
      </div>
    </div>
    <div class="justify-end space-x-8 mr-8 flex items-center">
      <span class="text-gray-500 text-sm">build {{ hash }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AppFooter",
  data() {
    return {
      hash: (this.$config.build || "n/a") as string,
    };
  },
});
</script>

<style lang="less" scoped></style>
