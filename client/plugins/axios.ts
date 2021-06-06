import { Context } from "@nuxt/types";

export default function ({ $axios, error }: Context) {
  $axios.defaults.timeout = 60000;

  $axios.onError((e) => {
    error({
      statusCode: e.response?.status || 404,
      message: e.message,
    });
  });
}
