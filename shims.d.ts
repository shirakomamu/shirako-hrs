// import VueRouter from "vue-router";

// declare module "vue" {
//   interface Vue {
//     $router: VueRouter;
//   }
// }

import { NuxtAxiosInstance } from "@nuxtjs/axios";

declare module "vue/types/vue" {
  interface Vue {
    $axios: NuxtAxiosInstance;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $axios: NuxtAxiosInstance;
  }

  interface Context {
    $axios: NuxtAxiosInstance;
  }
}

declare module "vuex/types/index" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $axios: NuxtAxiosInstance;
  }
}
