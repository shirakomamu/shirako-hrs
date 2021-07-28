<template>
  <div>
    <AppInitializing />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useRoute,
  useRouter,
  useStore,
  watch,
} from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Loading",
  middleware: ["loadingRoute"],
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const auth = computed<boolean>(() => store.getters["auth/loaded"]);

    const redirect = () => {
      if (route.value.query.r) {
        router.replace({
          path: decodeURIComponent(route.value.query.r.toString()),
        });
      } else {
        router.replace({ path: "/" });
      }
    };

    if (auth) {
      return redirect();
    }

    watch(auth, () => {
      redirect();
    });
  },
});
</script>

<style lang="less" scoped></style>
