import { Context } from "@nuxt/types";

export default ({ $axios, error: _error }: Context) => {
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
};
