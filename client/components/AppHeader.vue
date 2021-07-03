<template>
  <div class="nav flex items-center px-8">
    <div class="justify-start items-center">
      <nuxt-link
        v-slot="{ navigate }"
        to="/"
        class="space-x-4 flex items-center"
        custom
      >
        <div class="pointer" @click="navigate" @keypress.enter="navigate">
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
          py-1
          px-4
        "
      >
        Sign in
      </a>
      <Drop
        v-else
        :visible="popupVisible"
        container-class="p-8 drop-bottom drop-left bg-gray-100 dark:bg-gray-800 filter drop-shadow-2xl"
        @hide="popupVisible = false"
      >
        <template #default>
          <div class="flex flex-row gap-8 items-center">
            <nuxt-link to="/dashboard" class="text-blue-srk"
              ><Dashboard class="icon-inline" />
              <span class="hover:underline focus:underline"
                >Dashboard</span
              ></nuxt-link
            >
            <button class="p-0" @click="showPopup">
              <img
                :src="user && user.avatar"
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
              <nuxt-link to="/lists" class="text-blue-srk"
                ><ViewStream class="icon-inline" />
                <span class="hover:underline focus:underline"
                  >My lists</span
                ></nuxt-link
              >
              <nuxt-link to="/friends" class="text-blue-srk"
                ><People class="icon-inline" />
                <span class="hover:underline focus:underline"
                  >Friends</span
                ></nuxt-link
              >
              <nuxt-link to="/me" class="text-blue-srk"
                ><Settings class="icon-inline" />
                <span class="hover:underline focus:underline"
                  >My account</span
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
import { ActorDto } from "@@/common/dto/auth";
import {
  computed,
  defineComponent,
  ref,
  useContext,
  useStore,
} from "@nuxtjs/composition-api";
import Dashboard from "client/components/icons/Dashboard.vue";
import Logout from "client/components/icons/Logout.vue";
import People from "client/components/icons/People.vue";
import Settings from "client/components/icons/Settings.vue";
import ViewStream from "client/components/icons/ViewStream.vue";

export default defineComponent({
  name: "AppHeader",
  components: {
    Dashboard,
    Logout,
    People,
    Settings,
    ViewStream,
  },
  setup() {
    const context = useContext();
    const store = useStore();

    const appName = context.$config.appinfo.name;
    const popupVisible = ref<boolean>(false);
    const user = computed<ActorDto | null>(() => store.getters["auth/actor"]);
    const nickname = computed(
      (): string | null => user.value?.nickname || null
    );

    const showPopup = () => (popupVisible.value = true);

    const signOut = () => {
      window.location.href = "/api/auth/logout";
    };

    return { appName, user, nickname, popupVisible, showPopup, signOut };
  },
});
</script>

<style lang="less" scoped>
.pointer {
  cursor: pointer;
}

.app-icon {
  content: url("client/assets/images/icons/hrs-128bi.png");

  @media (prefers-color-scheme: dark) {
    content: url("client/assets/images/icons/hrs-128bi.png");
  }
}

.min-w-48 {
  min-width: 12rem;
}

.icon-inline {
  display: inline;
  height: 1.2em;
  width: 1.2em;
  cursor: pointer;
  position: relative;
  top: -2px;
}
</style>
