import { Middleware } from "@nuxt/types";
import RouteModel from "client/models/Route";

const middleware: Middleware = async ({
  store,
  error,
  route,
  redirect,
  from,
}) => {
  const isError = store.getters["auth/loginError"];

  if (isError) {
    if (process.client) {
      return error({ statusCode: 404 });
    } else if (process.server) {
      const uriComponent = encodeURIComponent(route.fullPath);
      const toRedirPath = `/login?redir=${uriComponent}`;
      if (route.fullPath !== toRedirPath) {
        return redirect(toRedirPath);
      }
    }
  }

  const grl = store.$db().model(RouteModel);

  // wait for authorization to finish
  let routeLoaded: Promise<Boolean>;
  if (process.client) {
    if (!store.getters["auth/isRouteDataLoaded"]) {
      routeLoaded = new Promise((resolve) => {
        const routeLoad = setInterval(() => {
          if (store.getters["auth/isRouteDataLoaded"]) {
            clearInterval(routeLoad);
            resolve(true);
          }
        }, 100);
      });
    } else {
      routeLoaded = new Promise((resolve) => resolve(true));
    }
  } else {
    routeLoaded = new Promise((resolve) => resolve(true));
  }

  await routeLoaded;

  const areAllRoutesMatched = grl.areAllRoutesMatched(
    route.matched.map((e) => e.path)
  );
  const isSignedIn = store.getters["auth/isSignedIn"];

  // if some are matched, but not enough
  if (process.client) {
    if (!areAllRoutesMatched) {
      if (isSignedIn) {
        return error({
          statusCode: 404,
        });
      } else {
        const uriComponent = encodeURIComponent(route.fullPath);
        const toRedirPath = `/login?redir=${uriComponent}`;

        // prevent self-loop
        if (from.fullPath === toRedirPath) {
          return redirect(toRedirPath + "#");
        }
        if (route.fullPath !== toRedirPath) {
          return redirect(toRedirPath);
        }
      }
    }
  }
};

export default middleware;
