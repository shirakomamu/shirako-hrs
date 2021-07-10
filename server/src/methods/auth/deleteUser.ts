import { SrkCookie } from "server/services/jwt";
import SrkError from "server/classes/SrkError";
import deleteUser from "server/services/auth0-mgmt/deleteUser";

export default async (authResult: SrkCookie): Promise<void> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  await deleteUser(authResult.actor.id);
};
