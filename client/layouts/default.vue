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

    <div
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
  defineComponent,
  onMounted,
  ref,
  // useStore,
} from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const refreshing = ref<boolean>(false);
    const registration = ref<null | ServiceWorkerRegistration>(null);
    const updateExists = ref<boolean>(false);

    // const store = useStore();
    // store.dispatch("auth/fetch");

    // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for
    const updateAvailable = (event: { detail: ServiceWorkerRegistration }) => {
      registration.value = event.detail;
      updateExists.value = true;
    };

    // Called when the user accepts the update
    const refreshApp = () => {
      updateExists.value = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!registration.value || !registration.value.waiting) return;

      // send message to SW to skip the waiting and activate the new SW
      registration.value.waiting.postMessage({ type: "SKIP_WAITING" });
    };

    onMounted(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.addEventListener("swUpdated", updateAvailable, {
        once: true,
      });

      // Prevent multiple refreshes
      navigator.serviceWorker?.addEventListener("controllerchange", () => {
        if (refreshing.value) return;
        refreshing.value = true;
        // Here the actual reload of the page occurs
        window.location.reload();
      });
    });

    return {
      refreshing,
      registration,
      updateExists,
      refreshApp,
    };
  },
});
</script>

<style lang="less" scoped></style>
