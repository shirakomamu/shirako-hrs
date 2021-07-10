/* eslint-disable camelcase */
import { GetUserResponse } from "./getUser";
import { setCache } from "./getUserCached";
import { send } from ".";

export interface UpdateUserResponse extends GetUserResponse {}

export default async (
  id: string,
  {
    username,
    nickname,
    email,
    user_metadata,
    app_metadata,
  }: {
    username?: string;
    nickname?: string;
    email?: string;
    user_metadata?: object;
    app_metadata?: object;
  }
) => {
  const ENDPOINT = "api/v2/users/" + id; // added onto issuer base url

  const response = await send<UpdateUserResponse>(ENDPOINT, {
    method: "patch",
    data: {
      username,
      nickname,
      email,
      user_metadata,
      app_metadata,
    },
  });

  await setCache({ id }, response);

  return response;
};
