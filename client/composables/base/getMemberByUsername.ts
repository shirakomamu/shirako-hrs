import { AxiosRequestConfig } from "axios";
import { ISrkResponse, IMemberPayload } from "common/types/api";

export default (
  api: <T = any>(options: AxiosRequestConfig) => Promise<ISrkResponse<T>>,
  username: string
) => {
  return api<IMemberPayload>({
    url: "/api/users/" + username,
  });
};
