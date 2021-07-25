import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Emitter, EventType } from "mitt";

declare module "vue/types/vue" {
  interface Vue {
    $axios: NuxtAxiosInstance;
    $emitter: Emitter<Record<EventType, unknown>>;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $axios: NuxtAxiosInstance;
    $emitter: Emitter<Record<EventType, unknown>>;
  }

  interface Context {
    $axios: NuxtAxiosInstance;
    $emitter: Emitter<Record<EventType, unknown>>;
  }
}

declare module "vuex/types/index" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $axios: NuxtAxiosInstance;
    $emitter: Emitter<Record<EventType, unknown>>;
  }
}
