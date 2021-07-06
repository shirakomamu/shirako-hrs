import { SrkCookie } from "src/services/jwt";
import { IVerifyEmailPayload } from "@@/common/types/api";
import sendVerificationEmail from "src/services/auth0-mgmt/sendVerificationEmail";
import SrkError from "src/classes/SrkError";

export default async (authResult: SrkCookie): Promise<IVerifyEmailPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const userId = authResult.actor.id;

  const userIdentitySplit = userId.split("|");

  await sendVerificationEmail({
    id: userId,
    identity: {
      provider: userIdentitySplit[0],
      user_id: userIdentitySplit[1],
    },
  });

  return {};
};
