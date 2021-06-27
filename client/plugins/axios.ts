import { defineNuxtPlugin } from "@nuxtjs/composition-api";

export default defineNuxtPlugin(({ $axios, error: _error }) => {
  $axios.defaults.timeout = 60000;

  // $axios.onError((e) => {
  //   console.log("Axios error");

  //   if (process.server) {
  //     error({
  //       statusCode: e.response?.status || 404,
  //       message: e.message,
  //     });
  //   }
  // });
});
