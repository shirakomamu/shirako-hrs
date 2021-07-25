import { defineNuxtPlugin } from "@nuxtjs/composition-api";
import mitt from "mitt";

export default defineNuxtPlugin((_context, inject) => {
  const emitter = mitt();

  inject("emitter", emitter);
});
