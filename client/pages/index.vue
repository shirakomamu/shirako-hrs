<template>
  <div class="space-y-8 flex flex-col">
    <div class="relative flex flex-col flex-grow">
      <div class="tag-contents flex-grow flex flex-col p-12 gap-8">
        <div class="flex-grow grid grid-cols-1 items-center">
          <div class="space-y-8">
            <img alt="Shirako logo" class="srk-icon" width="64" height="64" />
            <p class="text-3xl">
              <span class="font-bold">Shirako Eats.</span> It's a new way to
              eat.
            </p>
            <div class="text-2xl">
              <p>For indecisive people,</p>
              <p>by indecisive people.</p>
            </div>
            <div class="text-xl">
              <p>Just tell us which restaurants you like,</p>
              <p>and we'll pick for you.</p>
            </div>
          </div>
        </div>

        <div class="text-right">
          <div v-if="self">
            <p>Welcome back{{ nickname ? ", " + nickname : "" }}.</p>
            <nuxt-link
              v-if="emailVerified"
              to="/dashboard"
              class="font-semibold hover:underline focus:underline"
              >Go to dashboard →</nuxt-link
            >
            <nuxt-link
              v-else
              to="/settings"
              class="font-semibold hover:underline focus:underline"
              ><Error
                class="
                  icon-inline
                  text-red-500
                  md:text-white md:dark:text-red-500
                "
              />
              Please verify your email address →</nuxt-link
            >
          </div>
          <div v-else>
            <p>Ready to get started?</p>
            <a
              href="/api/auth/login"
              class="font-semibold hover:underline focus:underline"
            >
              Sign in or register →
            </a>
          </div>
        </div>
      </div>

      <div class="inset-0 absolute overflow-hidden">
        <div class="w-full h-full">
          <ImageFader
            class="
              dark:hidden
              w-full
              h-full
              object-cover
              filter
              blur-2xl
              transform-gpu
              scale-110
            "
            src="@/assets/images/t3.png"
          />
          <ImageFader
            class="
              hidden
              dark:block
              w-full
              h-full
              object-cover
              filter
              blur-2xl
              brightness-50
              transform-gpu
              scale-110
            "
            src="@/assets/images/t4.png"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  useContext,
  useMeta,
} from "@nuxtjs/composition-api";
import useSelf from "client/composables/useSelf";
import { Role } from "common/enums/hrbac";
import hrbacCan from "common/utils/hrbacCan";
import Error from "client/components/icons/Error.vue";

export default defineComponent({
  name: "Index",
  components: {
    Error,
  },

  setup() {
    const context = useContext();
    const self = useSelf();
    useMeta({ title: "Home | " + context.$config.appinfo.name });

    const nickname = computed(() => self.value?.nickname || null);
    const emailVerified = computed(() =>
      hrbacCan({ roles: [Role._email_verified] }, self.value)
    );

    return { self, nickname, emailVerified };
  },
  head: {},
});
</script>

<style lang="less" scoped>
.tag-bg {
  z-index: 1;
}

.tag-contents {
  background-color: transparent;

  @media (min-width: theme("screens.md")) {
    margin-left: 33%;
    background-color: lighten(desaturate(#ff7600, 30%), 5%);
    color: white;

    @media (prefers-color-scheme: dark) {
      background-color: rgba(25, 25, 25, 1);
      color: unset;
    }
  }

  z-index: 2;
}

.srk-icon {
  content: url("client/assets/images/icons/icon-512xt.png");

  @media (min-width: theme("screens.md")) {
    content: url("client/assets/images/icons/icon-512tt.png");
  }

  @media (prefers-color-scheme: dark) {
    content: url("client/assets/images/icons/icon-512ft.png");
  }
}
</style>
