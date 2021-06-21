import { Module, NuxtOptions } from "@nuxt/types";

const api: Module<NuxtOptions> = function (_moduleOptions) {
  // Add middleware only with `nuxt dev` or `nuxt start`
  if (this.options.dev || this.options._start) {
    this.addServerMiddleware("@@/server");
    this.addServerMiddleware("@@/nuxt-context-server");
  }
};

export default api;
