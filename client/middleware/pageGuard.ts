import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
import hrbacCan from "common/utils/hrbacCan";
import { ActorDto } from "common/dto/auth";
import { Guard } from "common/types/hrbac";

export default defineNuxtMiddleware(({ route, store, error, redirect }) => {
  if (process.server) {
    // const uriComponent = encodeURIComponent(route.fullPath);
    // const toRedirPath = `/loading?r=${uriComponent}`;

    // prevent self-loop
    // if (from?.fullPath === toRedirPath) {
    //   return redirect(toRedirPath + "#");
    // }
    if (route.path !== "/loading") {
      return redirect({
        path: "/loading",
        query: {
          r: encodeURIComponent(route.fullPath),
        },
      });
    } else {
      return;
    }
  }
  // route.meta is an array
  const result = (route.meta as any[]).map((meta) => {
    if (meta.guard) {
      return hrbacCan(
        meta.guard as Guard,
        store.getters["auth/actor"] as ActorDto
      );
    } else {
      return true;
    }
  });

  // wait for authorization to finish
  // let authLoaded: Promise<Boolean>;
  // if (!store.getters["auth/loaded"]) {
  //   authLoaded = new Promise((resolve) => {
  //     const authLoad = setInterval(() => {
  //       if (store.getters["auth/loaded"]) {
  //         clearInterval(authLoad);
  //         resolve(true);
  //       }
  //     }, 100);
  //   });
  // } else {
  //   authLoaded = new Promise((resolve) => resolve(true));
  // }

  // console.time("authLoaded");
  // await authLoaded;
  // console.timeEnd("authLoaded");

  if (!result.every((e) => e)) {
    error({
      statusCode: 404,
    });
  }
});
