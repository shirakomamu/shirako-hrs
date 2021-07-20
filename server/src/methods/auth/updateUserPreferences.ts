import { SrkCookie } from "server/services/jwt";
import { IUpdateUserPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import updateUser from "server/services/auth0-mgmt/updateUser";
import { Auth0UserMetadataDto } from "common/dto/auth";

export default async (
  authResult: SrkCookie,
  metadata: Auth0UserMetadataDto
): Promise<IUpdateUserPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const response = await updateUser(authResult.actor.id, {
    user_metadata: {
      privacySettings: {
        friendRequestPrivacy:
          metadata.privacySettings?.friendRequestPrivacy ||
          authResult.actor.meta.privacySettings?.friendRequestPrivacy,
        defaultListVisibility:
          metadata.privacySettings?.defaultListVisibility ||
          authResult.actor.meta.privacySettings?.defaultListVisibility,
      },
      locationSettings: {
        defaultLocation:
          metadata.locationSettings?.defaultLocation ||
          authResult.actor.meta.locationSettings?.defaultLocation,
      },
    },
  });

  return response;
};
