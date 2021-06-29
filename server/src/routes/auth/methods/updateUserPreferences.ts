import { SrkCookie } from "src/services/jwt";
import { IUpdateUserPrivacyPayload } from "@@/common/interfaces/api";
import SrkError from "src/classes/SrkError";
import updateUser from "src/services/auth0-mgmt/updateUser";
import { UpdateUserPrivacyDto } from "@@/common/dto/auth";

export default async (
  authResult: SrkCookie,
  { friendRequestPrivacy, defaultListVisibility }: UpdateUserPrivacyDto
): Promise<IUpdateUserPrivacyPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }
  const response = await updateUser(authResult.actor.id, {
    user_metadata: {
      privacySettings: {
        friendRequestPrivacy:
          friendRequestPrivacy ||
          authResult.actor.meta.privacySettings?.friendRequestPrivacy,
        defaultListVisibility:
          defaultListVisibility ||
          authResult.actor.meta.privacySettings?.defaultListVisibility,
      },
    },
  });

  return response;
};
