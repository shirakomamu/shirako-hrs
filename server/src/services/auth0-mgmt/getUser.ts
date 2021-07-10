/* eslint-disable camelcase */
import { send } from ".";

export interface GetUserResponse {
  user_id?: string;
  email?: string;
  email_verified?: boolean;
  username?: string;
  phone_number?: string;
  phone_verified?: boolean;
  created_at?: string;
  updated_at?: string;
  identities?: [
    {
      connection: string;
      user_id: string;
      provider: string;
      isSocial: boolean;
    }
  ];
  app_metadata?: object;
  user_metadata?: object;
  picture?: string;
  name?: string;
  nickname?: string;
  multifactor?: string[];
  last_ip?: string;
  last_login?: string;
  logins_count?: number;
  blocked?: boolean;
  given_name?: string;
  family_name?: string;
}

export default async (id: string) => {
  const ENDPOINT = "api/v2/users/" + id; // added onto issuer base url

  const response = await send<GetUserResponse>(ENDPOINT, { method: "get" });

  return response;
};
