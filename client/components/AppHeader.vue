<template>
  <div class="nav flex items-center px-8">
    <div class="justify-start items-center">
      <nuxt-link v-slot="{ navigate }" :to="!self ? '/' : '/dashboard'" custom>
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
    </div>
    <div class="flex-grow" />
    <div class="flex items-center text-sm">
      <a
        v-if="!self"
        key="sign-in-link"
        href="/api/auth/login"
        class="
          rounded-full
          bg-black
          dark:bg-white
          text-white
          dark:text-black
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
            <nuxt-link v-if="emailVerified" to="/dashboard" custom
              ><ComboButton class="p-0 text-orange-srk dark:text-blue-srk"
                ><Dashboard class="icon-inline" />
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
                ><Person class="icon-inline" />
                <span class="hover:underline focus:underline"
                  >Profile</span
                ></nuxt-link
              >
              <nuxt-link
                v-if="emailVerified"
                to="/friends"
                class="text-orange-srk dark:text-blue-srk"
                ><People class="icon-inline" />
                <span class="hover:underline focus:underline"
                  >Friends</span
                ></nuxt-link
              >
              <nuxt-link
                to="/settings"
                class="text-orange-srk dark:text-blue-srk"
                ><Settings class="icon-inline" />
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
              ><Logout class="icon-inline" /> Sign out</ComboButton
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
} from "@nuxtjs/composition-api";
import useSelf from "client/composables/useSelf";
import Dashboard from "client/components/icons/Dashboard.vue";
import Logout from "client/components/icons/Logout.vue";
import People from "client/components/icons/People.vue";
import Person from "client/components/icons/Person.vue";
import Settings from "client/components/icons/Settings.vue";
import hrbacCan from "common/utils/hrbacCan";
import { Role } from "common/enums/hrbac";

export default defineComponent({
  name: "AppHeader",
  components: {
    Dashboard,
    Logout,
    People,
    Person,
    Settings,
  },
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
  content: url("client/assets/images/icons/icon-512xt.png");

  @media (prefers-color-scheme: dark) {
    content: url("client/assets/images/icons/icon-512ft.png");
  }
}

.min-w-48 {
  min-width: 12rem;
}
</style>
