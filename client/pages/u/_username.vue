<template>
  <nuxt-child />
</template>

<script lang="ts">
import { defineComponent, useRoute, useRouter } from "@nuxtjs/composition-api";

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();

    // ensure that username is always in lowercase
    if (
      route.value.params.username !== route.value.params.username.toLowerCase()
    ) {
      router.replace({
        params: {
          username: route.value.params.username.toLowerCase(),
        },
      });
    }
  },
  // required for useMeta to work
  head: {},
});
</script>

<style lang="less" scoped></style>
