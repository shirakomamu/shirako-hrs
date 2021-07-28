import { defineNuxtMiddleware } from "@nuxtjs/composition-api";

export default defineNuxtMiddleware(({ store, route, redirect }) => {
  if (process.server) {
    return;
  }

  const isSignedIn = store.getters["auth/loaded"];

  if (isSignedIn && route.query.r) {
    const fullRedir = decodeURIComponent(route.query.r.toString());
    return redirect(fullRedir);
  } else {
    return redirect("/");
  }
});
