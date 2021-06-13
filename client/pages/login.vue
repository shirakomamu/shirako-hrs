<template>
  <div class="sign-in space-y-8 flex justify-center items-center">
    <div class="max-w-prose w-full bg-gray-200 dark:bg-gray-700 p-8">
      <form name="login" class="grid gap-4 w-full" @submit.prevent="onSubmit">
        <h5 class="text-2xl dark:text-white">Sign in</h5>
        <div class="grid gap-1">
          <label :for="userUid" class="text-sm">Username or email</label>
          <input
            :id="userUid"
            type="text"
            name="user"
            class="p-2 text-sm w-full"
            required
          />
        </div>
        <div class="grid gap-1">
          <label :for="passwordUid" class="text-sm">Password</label>
          <input
            :id="passwordUid"
            type="password"
            name="password"
            class="p-2 text-sm w-full"
            required
          />
        </div>

        <div>
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import uniqueId from "@@/common/utils/uniqueId";

export default Vue.extend({
  data() {
    return {
      uid: uniqueId() as string,
    };
  },
  head() {
    return {
      title: "Sign in | " + this.$config.appinfo.name,
    };
  },
  computed: {
    userUid(): string {
      return "username-" + this.uid;
    },
    passwordUid(): string {
      return "password-" + this.uid;
    },
  },
  methods: {
    onSubmit() {},
  },
});
</script>

<style lang="less" scoped></style>
