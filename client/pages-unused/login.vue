<template>
  <div class="sign-in space-y-8 flex justify-center items-center">
    <div class="max-w-prose w-full bg-gray-200 dark:bg-gray-700 p-8">
      <form
        name="login"
        class="grid grid-cols-1 gap-4 w-full"
        @submit.prevent="onSubmit"
      >
        <h5 class="text-2xl dark:text-white">
          Sign in to your {{ $config.appinfo.name }} account
        </h5>
        <div class="grid grid-cols-1 gap-1">
          <label :for="userUid" class="text-sm"
            >Username or email address</label
          >
          <input
            :id="userUid"
            v-model="user"
            type="text"
            name="user"
            class="p-2 text-sm w-full"
            required
          />
        </div>
        <div class="grid grid-cols-1 gap-1">
          <label :for="passwordUid" class="text-sm">Password</label>
          <input
            :id="passwordUid"
            v-model="password"
            type="password"
            name="password"
            class="p-2 text-sm w-full"
            required
          />
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4">
          <button
            type="submit"
            class="bg-black dark:bg-white text-white dark:text-black"
          >
            Sign in
          </button>
          <div class="grid grid-cols-1 gap-2">
            <nuxt-link
              to="/recover"
              class="
                text-sm text-gray-400
                hover:text-black
                focus:text-black
                dark:hover:text-white dark:focus:text-white
                transition-colors
              "
              >Forgot password?</nuxt-link
            >
          </div>
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
      user: null as string | null,
      password: null as string | null,
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
