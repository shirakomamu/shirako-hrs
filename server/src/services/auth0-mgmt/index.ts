/* eslint-disable camelcase */
import { Method } from "axios";
import { GENERAL_USAGE_PREFIX, GEN_ACCESS_TOKEN_KEY } from "src/config/redis";
import axios from "src/services/axios";
import createRedis from "src/services/redis";

interface TokenResponse {
  access_token: string;
  token_type: "Bearer";
}

const store = createRedis({
  keyPrefix: GENERAL_USAGE_PREFIX,
});

export async function getAccessToken() {
  const response = await axios.request<TokenResponse>({
    url: process.env.AUTH0_ISSUER_BASE_URL + "oauth/token",
    data: {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: process.env.AUTH0_API_AUDIENCE_MGMT,
      grant_type: "client_credentials",
    },
  });

  await store.set(
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
  payload: any
) {
  let accessToken = await store.get(GEN_ACCESS_TOKEN_KEY);

  if (!accessToken) {
    accessToken = await getAccessToken();
  }

  const response = await axios.request<T>({
    url: process.env.AUTH0_ISSUER_BASE_URL + endpoint,
    method,
    headers: {
      Authorization: "Bearer " + accessToken,
    },
    data: payload,
  });

  return response.data;
}

// --------------------------------- utilities
