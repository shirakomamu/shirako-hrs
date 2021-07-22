<template>
  <div class="space-y-8">
    <h5 class="text-4xl dark:text-white">Contact us</h5>
    <div class="space-y-8">
      <p>
        Do you have a question, feedback, or just want to get in touch? Please
        contact us through either of the channels below.
      </p>
      <p>We'll get back to you as quickly as we can.</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
      <div
        class="
          w-full
          max-w-prose
          grid
          place-items-center
          p-8
          rounded-lg
          bg-gray-200
          dark:bg-gray-700
          gap-4
          transform-gpu
          hover:scale-105
          transition
        "
      >
        <a
          href="https://shirako.atlassian.net/servicedesk/customer/portals"
          class="text-2xl hover:underline focus:underline font-semibold"
          target="_blank"
          rel="noopener noreferrer"
          >Help center</a
        >
        <p>Visit our online Help Center to submit an inquiry.</p>
        <a
          href="https://shirako.atlassian.net/servicedesk/customer/portals"
          class="
            hover:underline
            focus:underline
            text-orange-srk
            dark:text-blue-srk
          "
          target="_blank"
          rel="noopener noreferrer"
          >https://shirako.atlassian.net/servicedesk/customer/portals</a
        >
      </div>
      <div
        class="
          w-full
          max-w-prose
          grid
          place-items-center
          p-8
          rounded-lg
          bg-gray-200
          dark:bg-gray-700
          gap-4
          transform-gpu
          hover:scale-105
          transition
        "
      >
        <a
          href="mailto:support@shirako.atlassian.net"
          class="text-2xl hover:underline focus:underline font-semibold"
          >Email</a
        >
        <p>Contact us via email.</p>
        <a
          href="mailto:support@shirako.atlassian.net"
          class="
            hover:underline
            focus:underline
            text-orange-srk
            dark:text-blue-srk
          "
          >support@shirako.atlassian.net</a
        >
      </div>
    </div>
    <h6 class="text-2xl dark:text-white">About us</h6>
    <p>
      This project is created and maintained by
      <a
        href="https://shirako.dev"
        class="
          hover:underline
          focus:underline
          text-orange-srk
          dark:text-blue-srk
        "
        target="_blank"
        >shirako</a
      >.
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext, useMeta } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const context = useContext();
    useMeta({ title: "Contact us | " + context.$config.appinfo.name });
  },
  head: {},
});
</script>

<style lang="less" scoped></style>
