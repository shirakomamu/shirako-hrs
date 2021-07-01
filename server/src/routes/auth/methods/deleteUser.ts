import { SrkCookie } from "src/services/jwt";
import SrkError from "src/classes/SrkError";
import deleteUser from "src/services/auth0-mgmt/deleteUser";

export default async (authResult: SrkCookie): Promise<undefined> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const response = await deleteUser(authResult.actor.id);

  return response;
};
