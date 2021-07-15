import { AxiosRequestConfig } from "axios";
import axios from "server/services/axios";

// https://www.yelp.com/developers/documentation/v3/get_started
const BASE_URL = "https://api.yelp.com/v3/";

export async function send<T = any>(
  endpoint: string,
  options: Omit<AxiosRequestConfig, "url">
) {
  const { headers, ...remainingOptions } = options;

  const mergedHeaders = {
    Authorization: "Bearer " + process.env.YELP_API_KEY,
    ...headers,
  };

  const response = await axios.request<T>({
    url: BASE_URL + endpoint,
    headers: mergedHeaders,
    ...remainingOptions,
  });

  return response.data;
}
