import { defineNuxtMiddleware } from "@nuxtjs/composition-api";
import hrbacCan from "common/utils/hrbacCan";
import { ActorDto } from "common/dto/auth";
import { Guard } from "common/types/hrbac";

export default defineNuxtMiddleware(({ route, store, error }) => {
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

  if (!result.every((e) => e)) {
    error({
      statusCode: 404,
    });
  }
});
