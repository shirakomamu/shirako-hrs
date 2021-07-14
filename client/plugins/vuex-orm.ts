import VuexORM from "@vuex-orm/core";
import { Store } from "vuex";
import database from "client/database";

// VuexORM.use(VuexORMAxios, {
//   baseURL: "/api/",
// });

export default ({ store }: { store: Store<any> }) => {
  VuexORM.install(database)(store);
};
