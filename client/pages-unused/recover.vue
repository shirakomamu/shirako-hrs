<template>
  <div class="sign-in space-y-8 flex justify-center items-center">
    <div class="max-w-prose w-full bg-gray-200 dark:bg-gray-700 p-8">
      <form
        name="login"
        class="grid grid-cols-1 gap-4 w-full"
        @submit.prevent="onSubmit"
      >
        <h5 class="text-2xl dark:text-white">
          Recover your {{ $config.appinfo.name }} account
        </h5>
        <div class="grid grid-cols-1 gap-1">
          <label :for="emailUid" class="text-sm">Email address</label>
          <input
            :id="emailUid"
            type="email"
            name="email"
            class="p-2 text-sm w-full"
            required
          />
        </div>

        <div class="grid grid-cols-1 gap-4 mt-4">
          <button
            type="submit"
            class="bg-black dark:bg-white text-white dark:text-black"
          >
            Send recovery email
          </button>
          <div class="grid grid-cols-1 gap-2">
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
import { mapActions } from "vuex";
import uniqueId from "@@/common/utils/uniqueId";

export default Vue.extend({
  data() {
    return {
      uid: uniqueId() as string,
    };
  },
  head() {
    return {
      title: "Recover account | " + this.$config.appinfo.name,
    };
  },
  computed: {
    emailUid(): string {
      return "email-" + this.uid;
    },
  },
  methods: {
    async onSubmit() {
      // await this.api({
      //   method: "post",
      //   url: "/api/auth/recover",
      // });
    },
    ...mapActions({ api: "api/send" }),
  },
});
</script>

<style lang="less" scoped></style>
