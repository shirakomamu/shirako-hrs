<template>
  <div class="nav flex items-center px-8">
    <div class="justify-start flex flex-grow items-center">
      <div class="text-gray-500 text-sm">
        © 2021 白狐マム |
        <nuxt-link
          to="/privacy"
          class="
            text-orange-srk
            dark:text-blue-srk
            hover:underline
            focus:underline
          "
          >privacy</nuxt-link
        >
        |
        <nuxt-link
          to="/tos"
          class="
            text-orange-srk
            dark:text-blue-srk
            hover:underline
            focus:underline
          "
          >terms</nuxt-link
        >
        |
        <nuxt-link
          to="/contact"
          class="
            text-orange-srk
            dark:text-blue-srk
            hover:underline
            focus:underline
          "
          >contact</nuxt-link
        >
      </div>
    </div>
    <div class="justify-end space-x-8 flex items-center">
      <span class="text-gray-500 text-sm">build {{ hash }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from "@nuxtjs/composition-api";

export default defineComponent({
  name: "AppFooter",
  setup() {
    const context = useContext();
    const hash = context.$config.build || "n/a";

    return { hash };
  },
});
</script>

<style lang="less" scoped></style>
