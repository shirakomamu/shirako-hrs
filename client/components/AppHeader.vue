<template>
  <div class="nav flex items-center px-8">
    <div class="flex justify-start items-center gap-4">
      <nuxt-link
        v-slot="{ navigate }"
        :to="!self || !emailVerified ? '/' : '/dashboard'"
        custom
      >
        <div
          class="pointer space-x-4 flex flex-row items-center"
          @click="navigate"
          @keypress.enter="navigate"
        >
          <img class="app-icon" alt="App logo" width="32" height="32" />
          <span class="font-semibold show-when-wide dark:text-white">{{
            appName
          }}</span>
        </div>
      </nuxt-link>
      <nuxt-link to="/eol" class="text-red-500 text-sm">EOL</nuxt-link>
    </div>
    <div class="flex-grow" />
    <div class="flex items-center text-sm">
      <IconsLoader v-if="!isActorLoaded" class="icon-inline w-8 h-8" />
      <a
        v-else-if="!self"
        key="sign-in-link"
        href="/api/auth/login"
        class="
          rounded-full
          bg-black
          dark:(bg-white
          text-black) text-white
          font-semibold
          py-1
          px-4
        "
      >
        Sign in
      </a>
      <Drop
        v-else
        :visible="popupVisible"
        container-class="p-8 drop-bottom drop-left bg-gray-100 dark:bg-gray-800 filter drop-shadow-lg"
        @hide="popupVisible = false"
      >
        <template #default>
          <div class="flex flex-row gap-8 items-center">
            <nuxt-link
              v-if="emailVerified"
              v-slot="{ navigate }"
              to="/dashboard"
              custom
              ><ComboButton
                class="p-0 text-orange-srk dark:text-blue-srk"
                @click="navigate"
                ><IconsDashboard class="icon-inline" />
                <span class="hover:underline focus:underline"
                  >Dashboard</span
                ></ComboButton
              ></nuxt-link
            >
            <button class="p-0" @click="showPopup">
              <img
                :src="self && self.avatar"
                class="profile-avatar rounded-full pointer"
                alt="Avatar"
                width="32"
                height="32"
              />
            </button>
          </div>
        </template>
        <template #tooltip>
          <div class="grid grid-cols-1 gap-8 min-w-48">
            <div class="grid grid-cols-1 justify-items-center">
              <p class="opacity-50">signed in as</p>
              <p class="font-semibold dark:text-white">{{ nickname }}</p>
            </div>

            <hr />

            <div class="grid grid-cols-1 gap-4 justify-items-center">
              <nuxt-link
                :to="'/u/' + username"
                class="text-orange-srk dark:text-blue-srk"
                ><IconsPerson class="icon-inline" />
                <span class="hover:underline focus:underline"
                  >Profile</span
                ></nuxt-link
              >
              <nuxt-link
                to="/settings"
                class="text-orange-srk dark:text-blue-srk"
                ><IconsSettings class="icon-inline" />
                <span class="hover:underline focus:underline"
                  >Settings</span
                ></nuxt-link
              >
            </div>

            <hr />

            <ComboButton
              alt="Sign out"
              class="text-sm text-red-500 border border-red-500"
              @click="signOut"
              ><IconsLogout class="icon-inline" /> Sign out</ComboButton
            >
          </div>
        </template>
      </Drop>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useStore,
} from "@nuxtjs/composition-api";
import useSelf from "client/composables/useSelf";
import hrbacCan from "common/utils/hrbacCan";
import { Role } from "common/enums/hrbac";

export default defineComponent({
  name: "AppHeader",
  setup() {
    const context = useContext();
    const self = useSelf();

    const appName = context.$config.appinfo.name;
    const popupVisible = ref<boolean>(false);
    const username = computed(() => self.value?.username || null);
    const nickname = computed(() => self.value?.nickname || null);
    const emailVerified = computed(() =>
      hrbacCan({ roles: [Role._email_verified] }, self.value)
    );

    const store = useStore();

    const isActorLoaded = computed(() => store.getters["auth/loaded"]);

    const showPopup = () => (popupVisible.value = true);

    const signOut = () => {
      window.location.href = "/api/auth/logout";
    };

    // const onDashboardClick = () => {
    //   context.$emitter.emit("go-to-dashboard");
    // };

    return {
      appName,
      self,
      username,
      nickname,
      emailVerified,
      popupVisible,
      showPopup,
      signOut,
      isActorLoaded,
      // onDashboardClick,
    };
  },
});
</script>

<style lang="less" scoped>
.pointer {
  cursor: pointer;
}

.app-icon {
  content: url("/icons/512-tr-or.png");

  @media (prefers-color-scheme: dark) {
    content: url("/icons/512-tr-bl.png");
  }
}

.min-w-48 {
  min-width: 12rem;
}
</style>
