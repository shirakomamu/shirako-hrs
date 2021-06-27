<template>
  <div class="nav flex items-center">
    <div class="justify-start ml-8 mr-4 items-center">
      <nuxt-link
        v-slot="{ navigate }"
        to="/"
        class="space-x-4 flex items-center"
        custom
      >
        <div class="pointer" @click="navigate" @keypress.enter="navigate">
          <img class="app-icon" alt="shirako-hrs logo" width="32" height="32" />
          <span class="font-semibold show-when-wide dark:text-white">{{
            appName
          }}</span>
        </div>
      </nuxt-link>
    </div>
    <div class="flex-grow" />
    <div class="space-x-4 ml-4 mr-8 flex items-center align-middle text-sm">
      <a
        v-if="!user"
        key="sign-in-link"
        href="/api/auth/login"
        class="
          rounded-full
          bg-black
          dark:bg-white
          text-white
          dark:text-black
          font-semibold
          px-4
          py-1
        "
      >
        Sign in
      </a>
      <nuxt-link v-else v-slot="{ navigate }" class="p-0" to="/me" custom>
        <img
          :src="user && user.avatar"
          class="profile-avatar rounded-full pointer"
          alt="profile"
          width="32"
          height="32"
          @click="navigate"
          @keypress.enter="navigate"
        />
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useStore,
} from "@nuxtjs/composition-api";

export default defineComponent({
  name: "AppHeader",
  setup() {
    const context = useContext();
    const store = useStore();

    const appName = context.$config.appinfo.name;
    const user = computed(() => store.getters["auth/actor"]);

    return { appName, user };
  },
});
</script>

<style lang="less" scoped>
.pointer {
  cursor: pointer;
}

.app-icon {
  content: url("/images/icons/hrs-128bi.png");

  @media (prefers-color-scheme: dark) {
    content: url("/images/icons/hrs-128bi.png");
  }
}
</style>
