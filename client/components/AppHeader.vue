<template>
  <div class="nav flex items-center">
    <div class="justify-start ml-8 mr-4 items-center">
      <nuxt-link to="/" class="space-x-4 flex items-center">
        <img class="app-icon" alt="shirako-hrs logo" width="32" height="32" />
        <span class="font-semibold show-when-wide dark:text-white">{{
          appName
        }}</span></nuxt-link
      >
    </div>
    <div class="flex-grow" />
    <div class="space-x-4 ml-4 mr-8 flex items-center align-middle text-sm">
      <nuxt-link v-if="!user" to="/login">Sign in</nuxt-link>
      <nuxt-link v-if="!user" v-slot="{ navigate }" to="/register" custom>
        <button
          type="button"
          class="
            rounded-full
            bg-black
            dark:bg-white
            text-white
            dark:text-black
            font-semibold
          "
          @click="navigate"
          @keypress.enter="navigate"
        >
          Sign up
        </button>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapGetters } from "vuex";

// dark:text-gray-100
// text-sm
// link-underline-animate

export default Vue.extend({
  name: "AppHeader",
  data() {
    return {
      appName: this.$config.appinfo.name as string,
    };
  },
  computed: {
    ...mapGetters({
      user: "auth/user",
    }),
  },
  methods: {
    isRouteMatched(to: string) {
      return this.$route.matched.some(({ path }) => path === to);
    },
  },
});
</script>

<style lang="less" scoped>
.link-underline-animate {
  position: relative;
  text-decoration: none;

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 50%;
    bottom: 0;
    height: 1px;
    transition: width 0.3s ease 0s, left 0.3s ease 0s;
    width: 0;
    background: rgba(0, 0, 0, var(--tw-text-opacity));
    @media (prefers-color-scheme: dark) {
      background: rgba(243, 244, 246, var(--tw-text-opacity));
    }
  }
  &:hover:after,
  &:focus:after {
    width: 100%;
    left: 0;
  }
}

.app-icon {
  content: url("/images/icons/hrs-128bi.png");

  @media (prefers-color-scheme: dark) {
    content: url("/images/icons/hrs-128bi.png");
  }
}
</style>
