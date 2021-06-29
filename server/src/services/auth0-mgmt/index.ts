/* eslint-disable camelcase */
import { Method } from "axios";
import { GEN_ACCESS_TOKEN_KEY } from "src/config/redis";
import axios from "src/services/axios";
import guRedis from "src/services/gu-redis";

interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
}

interface SendOptions {
  includeAccessToken?: boolean;
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

  await guRedis.set(
    GEN_ACCESS_TOKEN_KEY,
    response.data.access_token,
    "ex",
    86400
  );

  return response.data.access_token;
}

export async function send<T = any>(
  endpoint: string,
  method: Method,
  payload?: any,
  options?: SendOptions
) {
  const includeAccessToken = options?.includeAccessToken || true;

  const headers: { [key: string]: string } = {};
  if (includeAccessToken) {
    let accessToken = await guRedis.get(GEN_ACCESS_TOKEN_KEY);

    if (!accessToken) {
      accessToken = await getAccessToken();
    }

    headers.Authorization = "Bearer " + accessToken;
  }

  const response = await axios.request<T>({
    method,
    url: process.env.AUTH0_ISSUER_BASE_URL + endpoint,
    headers,
    data: payload,
  });

  return response.data;
}
