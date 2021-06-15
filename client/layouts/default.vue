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

    <div class="pt-8 pb-8 flex flex-col flex-grow justify-center">
      <transition name="fade" mode="out-in">
        <Nuxt class="flex-1 w-full mx-auto px-8 max-w-screen-2xl" />
      </transition>
    </div>

    <AppFooter
      class="
        bg-flat
        border-t border-gray-300
        dark:border-gray-600
        bg-white
        dark:bg-gray-800
      "
    />
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      refreshing: false as boolean,
      registration: null as null | ServiceWorkerRegistration,
      updateExists: false as boolean,
    };
  },
  mounted() {
    // Listen for our custom event from the SW registration
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.addEventListener("swUpdated", this.updateAvailable, {
      once: true,
    });

    // Prevent multiple refreshes
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.refreshing) return;
      this.refreshing = true;
      // Here the actual reload of the page occurs
      window.location.reload();
    });
  },
  methods: {
    // Store the SW registration so we can send it a message
    // We use `updateExists` to control whatever alert, toast, dialog, etc we want to use
    // To alert the user there is an update they need to refresh for
    updateAvailable(event: { detail: ServiceWorkerRegistration }) {
      this.registration = event.detail;
      this.updateExists = true;
    },

    // Called when the user accepts the update
    refreshApp() {
      this.updateExists = false;
      // Make sure we only send a 'skip waiting' message if the SW is waiting
      if (!this.registration || !this.registration.waiting) return;

      // send message to SW to skip the waiting and activate the new SW
      this.registration.waiting.postMessage({ type: "SKIP_WAITING" });
    },
  },
});
</script>

<style lang="less" scoped>
.bg-flat {
  background-color: #fff;
  @media (prefers-color-scheme: dark) {
    background-color: #191919;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
