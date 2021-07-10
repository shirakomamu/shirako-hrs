/* eslint-disable camelcase */
import { AxiosRequestConfig } from "axios";
import { GEN_ACCESS_TOKEN_KEY } from "server/config/redis";
import axios from "server/services/axios";
import redisGu from "server/services/redis-gu";

interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
}

export async function getAccessToken() {
  const response = await axios.request<TokenResponse>({
    method: "post",
    url: process.env.AUTH0_ISSUER_BASE_URL + "oauth/token",
    data: {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_API_AUDIENCE_MGMT,
      grant_type: "client_credentials",
    },
  });

  await redisGu.set(
    GEN_ACCESS_TOKEN_KEY,
    response.data.access_token,
    "ex",
    86400
  );

  return response.data.access_token;
}

export async function send<T = any>(
  endpoint: string,
  options: Omit<AxiosRequestConfig, "url">
) {
  const includeAccessToken = true;

  const headers: { [key: string]: string } = {};
  if (includeAccessToken) {
    let accessToken = await redisGu.get(GEN_ACCESS_TOKEN_KEY);

    if (!accessToken) {
      accessToken = await getAccessToken();
    }

    headers.Authorization = "Bearer " + accessToken;
  }

  const response = await axios.request<T>({
    url: process.env.AUTH0_ISSUER_BASE_URL + endpoint,
    headers,
    ...options,
  });

  return response.data;
}
