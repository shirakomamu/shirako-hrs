<template>
  <div class="error space-y-8">
    <img
      alt="Cat on keyboard"
      src="@/assets/images/irasutoya/shigoto_zaitaku_cat_man.png"
      class="mx-auto h-64"
    />
    <article class="space-y-4">
      <h4 class="text-4xl dark:text-white">404 - Page not found</h4>
      <p>
        The page at <code>{{ $route.path }}</code> could not be found.
      </p>
    </article>
    <div>
      <button
        type="button"
        class="font-semibold dark:text-white hover:underline focus:underline"
        @click="$router.push('/')"
      >
        Go back to home page
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Error",
  head() {
    return {
      title: "Error | " + this.$config.appinfo.name,
    };
  },
});
</script>
