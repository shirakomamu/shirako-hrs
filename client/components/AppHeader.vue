<template>
  <div class="nav flex items-center">
    <div class="justify-start ml-8 mr-4 items-center flex-grow">
      <router-link to="/" class="space-x-4 flex items-center">
        <img class="app-icon" alt="shirako-hrs logo" width="32" height="32" />
        <span class="font-semibold show-when-wide dark:text-white">{{
          appName
        }}</span></router-link
      >
    </div>
    <div class="flex-shrink space-x-8 ml-4 mr-8 flex items-center">
      <router-link
        v-for="(link, index) of links"
        :key="index"
        :to="link.to"
        class="align-middle dark:text-gray-100 text-sm link-underline-animate"
        :class="{ 'font-bold': isRouteMatched(link.to) }"
        >{{ link.label }}</router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AppHeader",
  data() {
    return {
      appName: this.$config.appinfo.name as string,
      links: [
        {
          to: "/",
          label: "Home",
        },
        {
          to: "/projects",
          label: "Projects",
        },
        {
          to: "/about",
          label: "About",
        },
      ] as { to: string; label: string }[],
    };
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
