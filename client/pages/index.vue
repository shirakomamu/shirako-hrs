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
              <p>and we'll do the rest.</p>
            </div>
          </div>
        </div>

        <div class="text-right">
          <div v-if="user">
            <p>Welcome back{{ nickname ? ", " + nickname : "" }}.</p>
            <nuxt-link
              to="/dashboard"
              class="font-semibold hover:underline focus:underline"
              >Go to dashboard →</nuxt-link
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
        <div
          class="
            tag-bg
            inset-0
            w-full
            h-full
            filter
            scale-110
            bg-left bg-no-repeat bg-cover
          "
        />
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
import useUser from "client/composables/useUser";

export default defineComponent({
  name: "Index",
  setup() {
    const context = useContext();
    const user = useUser();
    useMeta({ title: "Home | " + context.$config.appinfo.name });

    const nickname = computed(
      (): string | null => user.value?.nickname || null
    );

    return { user, nickname };
  },
  head: {},
});
</script>

<style lang="less" scoped>
.tag-bg {
  background-image: url("client/assets/images/t5.png");
  filter: blur(24px);

  @media (prefers-color-scheme: dark) {
    background-image: url("client/assets/images/t6.png");
    filter: brightness(50%) blur(24px);
  }

  z-index: 1;
}

.tag-contents {
  background-color: transparent;

  @media (min-width: theme("screens.md")) {
    margin-left: 33%;
    background-color: rgb(255, 118, 0);
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
