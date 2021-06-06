import { Module, NuxtOptions } from "@nuxt/types";
import load from "../../../server";

const api: Module<NuxtOptions> = async function (_moduleOptions) {
  // Add middleware only with `nuxt dev` or `nuxt start`
  if (this.options.dev || this.options._start) {
    await this.addServerMiddleware({ path: "/api", handler: await load() });
  }
};

export default api;
