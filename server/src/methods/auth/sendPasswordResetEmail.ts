import { SrkCookie } from "server/services/jwt";
import { IResetPasswordPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import sendPasswordResetEmail from "server/services/auth0-mgmt/sendPasswordResetEmail";

export default async (
  authResult: SrkCookie
): Promise<IResetPasswordPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  await sendPasswordResetEmail({
    email: authResult.actor.email,
  });

  return {};
};
