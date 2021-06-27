import { defineNuxtPlugin } from "@nuxtjs/composition-api";
import VuexPersistence from "vuex-persist";
import { get, set, remove } from "js-cookie";

export default defineNuxtPlugin(({ store }) => {
  new VuexPersistence({
    key: "hrs-vuex", // default is "vuex"
    storage: {
      getItem: (key: string) => get(key) as any,
      setItem: (key: string, data: any) =>
        set(key, data, {
          expires: 3,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        }) as any,
      removeItem: (key: string) => remove(key) as any,
    } as any, // default is window.localStorage
    modules: ["auth"], // modules to save
  }).plugin(store);
});
