import VuexORM from "@vuex-orm/core";
import { Store } from "vuex";
import database from "client/database";
import { defineNuxtPlugin } from "@nuxtjs/composition-api";

// VuexORM.use(VuexORMAxios, {
//   baseURL: "/api/",
// });

export default defineNuxtPlugin(({ store }: { store: Store<any> }) => {
  VuexORM.install(database)(store);
});
