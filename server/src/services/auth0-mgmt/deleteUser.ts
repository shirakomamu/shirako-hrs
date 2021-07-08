/* eslint-disable camelcase */
import { clearCache } from "./getUserCached";
import { send } from ".";

export default async (id: string) => {
  const ENDPOINT = "api/v2/users/" + id; // added onto issuer base url

  await send<void>(ENDPOINT, "delete");
  await clearCache(id);
};
