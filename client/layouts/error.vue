<template>
  <div class="error space-y-8">
    <img
      alt="Cat on keyboard"
      src="@/assets/images/irasutoya/shigoto_zaitaku_cat_man.png"
      class="mx-auto h-64"
    />
    <article class="space-y-4">
      <h4 class="text-4xl dark:text-white">{{ statusCode }} - {{ message }}</h4>
      <p v-if="statusCode === 404">
        The page at <code>{{ path }}</code> could not be found.
      </p>
    </article>
    <div>
      <ComboButton
        class="
          font-semibold
          text-orange-srk
          dark:text-blue-srk
          hover:underline
          focus:underline
          p-0
        "
        @click="goHome"
      >
        <IconsArrowBack class="icon-inline" /> Back to home page
      </ComboButton>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  useMeta,
  useContext,
  computed,
  useRouter,
  useRoute,
} from "@nuxtjs/composition-api";

export default defineComponent({
  name: "Error",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const context = useContext();
    const route = useRoute();
    useMeta({ title: "Error | " + context.$config.appinfo.name });

    const statusCode = computed(
      () => (props.error && props.error.statusCode) || 500
    );

    const router = useRouter();

    const goHome = () => {
      router.push("/");
    };

    const message = computed(() =>
      statusCode.value === 404 ? "Not found" : "Error"
    );
    const path = computed(() => props.error.path || route.value.path);

    return { statusCode, message, path, goHome };
  },
  // empty head is required for useMeta to work
  head: {},
});
</script>
