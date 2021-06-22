<template>
  <div class="sign-in space-y-8 flex justify-center items-center">
    <div class="max-w-prose w-full bg-gray-200 dark:bg-gray-700 p-8 grid gap-8">
      <h5 class="text-2xl dark:text-white">Account verified</h5>
      <div class="grid gap-4 text-sm">
        <p>Your account has been successfully verified.</p>
        <nuxt-link
          to="/login"
          class="text-blue-500 hover:underline focus:underline"
          >Please sign in.</nuxt-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  asyncData({ route, redirect }) {
    if (!route.params?.otpToken) {
      redirect("/");
    }

    return {};
  },
});
</script>

<style lang="less" scoped></style>
