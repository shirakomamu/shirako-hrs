<template>
  <div class="register space-y-8 flex justify-center items-center">
    <div class="max-w-prose w-full bg-gray-200 dark:bg-gray-700 p-8">
      <form name="login" class="grid gap-4 w-full" @submit.prevent="onSubmit">
        <h5 class="text-2xl dark:text-white">
          Create your {{ $config.appinfo.name }} account
        </h5>
        <div class="grid gap-1">
          <label :for="userUid" class="text-sm">Username</label>
          <Input
            :id="userUid"
            v-model="username"
            :validator="usernameValidator"
            type="text"
            name="username"
            classes="p-2 text-sm w-full"
            passive-text="Username is used to log into your account."
            required
          />
        </div>

        <div class="grid gap-1">
          <label :for="displayNameUid" class="text-sm">Display name</label>
          <Input
            :id="displayNameUid"
            v-model="displayName"
            :validator="displayNameValidator"
            type="text"
            name="displayName"
            classes="p-2 text-sm w-full"
            passive-text="Display name is how you will be identified to other users."
            required
          />
        </div>

        <div class="grid gap-1">
          <label :for="emailUid" class="text-sm"
            >Email address <span class="opacity-50">(optional)</span></label
          >
          <Input
            :id="emailUid"
            v-model="email"
            type="email"
            name="email"
            classes="p-2 text-sm w-full"
            passive-text="Email address is only used to verify and recover your account."
          />
        </div>

        <div class="grid gap-1">
          <label :for="passwordUid" class="text-sm">Password</label>
          <PasswordInput
            :id="passwordUid"
            v-model="password"
            name="password"
            classes="p-2 text-sm w-full"
            required
          />
        </div>

        <div class="grid gap-4 mt-4">
          <button
            type="submit"
            class="bg-black dark:bg-white text-white dark:text-black"
          >
            Create account
          </button>
          <div class="grid gap-2">
            <nuxt-link
              to="/login"
              class="
                text-sm text-gray-400
                hover:text-black
                focus:text-black
                dark:hover:text-white dark:focus:text-white
                transition-colors
              "
              >Sign in to existing account</nuxt-link
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
      username: null as string | null,
      displayName: null as string | null,
      email: null as string | null,
      password: null as string | null,
    };
  },
  head() {
    return {
      title: "Create an account | " + this.$config.appinfo.name,
    };
  },
  computed: {
    userUid(): string {
      return "username-" + this.uid;
    },
    displayNameUid(): string {
      return "display-name-" + this.uid;
    },
    emailUid(): string {
      return "email-" + this.uid;
    },
    passwordUid(): string {
      return "password-" + this.uid;
    },
  },
  methods: {
    usernameValidator(value: string) {
      if (value.length < 1 || value.length > 24) {
        return "Username must be 1 to 24 characters long.";
      }
      if (!/^[A-z0-9]+$/.test(value)) {
        return "Username must consist of letters and numbers only.";
      }
      return "";
    },
    displayNameValidator(value: string) {
      if (value.length < 1 || value.length > 24) {
        return "Display name must be 1 to 24 characters long.";
      }
      return "";
    },
    onSubmit() {},
  },
});
</script>

<style lang="less" scoped></style>
