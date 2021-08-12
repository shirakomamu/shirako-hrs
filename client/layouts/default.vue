<template>
  <div
    class="
      bg-flat
      layout-container
      h-full
      text-black
      dark:text-gray-200
      flex flex-col
    "
  >
    <AppHeader
      class="
        sticky
        bg-flat
        top-0
        h-12
        z-50
        w-full
        border-b border-gray-300
        dark:border-gray-600
      "
    />

    <AppInitializing v-if="!isAuthLoaded" />
    <div
      v-else
      class="flex flex-col flex-grow justify-center"
      :class="{
        'py-8': $route.path !== '/',
      }"
    >
      <transition name="fade" mode="out-in">
        <Nuxt
          class="flex-1 w-full mx-auto"
          :class="{
            'px-8 max-w-screen-2xl': $route.path !== '/',
          }"
        />
      </transition>
    </div>

    <AppFooter
      class="
        bg-flat
        border-t border-gray-300
        dark:(border-gray-600
        bg-gray-800) bg-white
        h-12
      "
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useStore,
  // useStore,
} from "@nuxtjs/composition-api";
import { FriendModel } from "client/models";
import { ISelfIdentifyPayload, ISrkResponse } from "common/types/api";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ja from "javascript-time-ago/locale/ja";

export default defineComponent({
  setup() {
    const store = useStore();

    const isAuthLoaded = computed(() => store.getters["auth/loaded"]);
    const refreshing = ref<boolean>(false);
    const registration = ref<null | ServiceWorkerRegistration>(null);
    const updateExists = ref<boolean>(false);

    const refreshApp = () => {
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!registration.value || !registration.value.waiting) return;

      // send message to SW to skip the waiting and activate the new SW
      registration.value.waiting.postMessage({ type: "SKIP_WAITING" });
    };

    // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for
    const onUpdateAvailable = (event: {
      detail: ServiceWorkerRegistration;
    }) => {
      registration.value = event.detail;
      updateExists.value = true;

      // automatic refresh when update is available
      refreshApp();
    };

    onMounted(async () => {
      // initialize ta with user's language if available
      const getLanguage = () =>
        (navigator &&
          navigator.languages &&
          navigator.languages.length &&
          navigator.languages[0]) ||
        navigator.language ||
        "en";

      TimeAgo.addDefaultLocale(en);
      TimeAgo.addLocale(ja);

      const timeAgo = new TimeAgo(getLanguage());
      store.commit("setTimeAgo", timeAgo);

      // this is called when sw receives SKIP_WAITING event
      navigator.serviceWorker?.addEventListener("controllerchange", () => {
        // Prevent multiple refreshes
        if (refreshing.value) return;
        refreshing.value = true;
        // Here the actual reload of the page occurs
        window.location.reload();
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.addEventListener("swUpdated", onUpdateAvailable, {
        once: true,
      });

      const r: ISrkResponse<ISelfIdentifyPayload> = await store.dispatch(
        "auth/fetch"
      );
      if (r.ok && r.payload.actor?.id) {
        await store.$db().model(FriendModel).apiLoad();
      }
    });

    return {
      isAuthLoaded,
      refreshing,
      registration,
      updateExists,
      onUpdateAvailable,
      refreshApp,
    };
  },
});
</script>

<style lang="less" scoped></style>
