<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">End of service</h5>
    <div class="space-y-8">
      <p>
        Regrettably, we will be terminating service of Shirako Eats, effective
        November 28, 2022.
      </p>
      
      <p>
        Our hosting provider, Heroku, has
        <a
          href="https://blog.heroku.com/next-chapter"
          class="
            hover:underline
            focus:underline
            text-orange-srk
            dark:text-blue-srk
          "
          target="_blank"
          rel="noopener noreferrer"
          >announced the end of service for free dyno products</a
        >
        which Shirako Eats relies on for providing service to you.
      </p>

      <p>
        We do not have any current plans to migrate to a different provider.
      </p>

      <p>
        We will not be preserving any data in our database after service
        closure. However, your account will remain active within Auth0 unless
        you choose to delete it. You may delete your account from the
        <nuxt-link
        to="/settings"
        class="
          text-orange-srk
          dark:text-blue-srk
          hover:underline
          focus:underline
        "
        >Settings</nuxt-link
        >
        page before service termination.
      </p>

      <p>
        If you wish to delete your Auth0 account after service ends, please
        contact us through any of our
        <nuxt-link
        to="/contact"
        class="
          text-orange-srk
          dark:text-blue-srk
          hover:underline
          focus:underline
        "
        >contact methods</nuxt-link
        >.
        We will remain accessible to delete your stored personal information
        or to answer any inquiries you may have.
      </p>

      <p>
        It has been a pleasure to provide this service, and we hope to see you
        again someday. Goodbye for now!
      </p>

      <p>
        <em>- マム</em>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const context = useContext();
    useMeta({ title: "End of service | " + context.$config.appinfo.name });
  },
  head: {},
});
</script>

<style lang="less" scoped>

</style>
