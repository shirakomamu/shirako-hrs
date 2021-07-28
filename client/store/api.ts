import { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import { ActionTree } from "vuex";
import { ISrkResponse } from "common/types/api";

export const state = () => ({});

export interface ModuleState extends ReturnType<typeof state> {}

export const actions: ActionTree<ModuleState, ModuleState> = {
  async send(
    { commit: _commit, dispatch: _dispatch },
    { ...requestArgs }: AxiosRequestConfig
  ): Promise<ISrkResponse> {
    try {
      // console.log("Sending axios request", requestArgs);
      const response: AxiosResponse<ISrkResponse> = await this.$axios({
        ...requestArgs,
      });

      return response.data;
    } catch (error: any) {
      // console.log("Axios error", error);
      // console.log(error.response?.status);
      // console.log(error.response?.data);
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
};
