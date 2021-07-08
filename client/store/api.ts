import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { ActionTree } from "vuex";
import ISrkResponse from "common/types/api";

export const state = () => ({});

export type ModuleState = ReturnType<typeof state>;

export const actions: ActionTree<ModuleState, ModuleState> = {
  async send(
    { commit: _commit, dispatch: _dispatch },
    { ...requestArgs }: AxiosRequestConfig
  ): Promise<ISrkResponse> {
    try {
      const response: AxiosResponse<ISrkResponse> = await this.$axios({
        ...requestArgs,
      });

      return response.data;
    } catch (error: any) {
      const axiosError = error as AxiosError<ISrkResponse>;
      if (axiosError.response?.status === 401) {
        // commit("auth/setJwtValid", false, { root: true });
        // commit("auth/setSignedIn", false, { root: true });
      }

      if (axiosError.response?.data) {
        // dispatch("showNotification", error.response.data);
      }

      return (
        axiosError.response?.data || {
          ok: false,
          error: {
            name: "unknown",
          },
        }
      );
    }
  },
  showNotification({ rootGetters: _rootGetters }, response) {
    if (process.client) {
      // rootGetters["uikit/instance"].notification({
      //   message: `<div class="uk-flex uk-flex-middle"><span uk-icon="icon: ${
      //     response.ok ? "check" : "warning"
      //   };" class="${
      //     response.ok ? "success-mark" : "error-mark"
      //   } uk-margin-small-right"></span><span>${
      //     response.ok
      //       ? "Request processed successfully."
      //       : `Error: [${response.error}]`
      //   }</span></div>`,
      //   pos: "top-right",
      //   timeout: 5000,
      // });
    }

    return response;
  },
};
