import ISrkResponse from "common/types/api";
import { useStore } from "@nuxtjs/composition-api";
import { AxiosRequestConfig } from "axios";

const useInternalApi = () => {
  const store = useStore();
  const sendFunction = <T = any>(
    payload: AxiosRequestConfig
  ): Promise<ISrkResponse<T>> => {
    return store.dispatch("api/send", payload);
  };

  return sendFunction;
};

export default useInternalApi;
