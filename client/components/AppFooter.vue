<template>
  <div class="nav h-12 flex items-center">
    <div class="justify-start ml-8 flex flex-grow items-center">
      <div class="text-gray-500 text-sm">
        <span>© {{ new Date().getFullYear() }} 白子マム</span> |
        <!-- <span
          ><EmailHider :text="emailText" :show-email-as-text="false"
        /></span> -->
        <router-link
          to="/privacy"
          class="text-blue-500 hover:underline focus:underline"
          >privacy</router-link
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
      hash: (process.env.VUE_APP_GIT_HASH || "n/a") as string,
      emailText: "✉️ say hello" as string,
    };
  },
});
</script>

<style lang="less" scoped></style>
