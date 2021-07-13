import { ISrkResponse } from "common/types/api";
import { useStore } from "@nuxtjs/composition-api";
import { AxiosRequestConfig } from "axios";

const useInternalApi = () => {
  const store = useStore();
  const sendFunction = async <T = any>(
    options: AxiosRequestConfig
  ): Promise<ISrkResponse<T>> => {
    const r: ISrkResponse<T> = await store.dispatch("api/send", options);

    return r;
  };

  return sendFunction;
};

export default useInternalApi;
