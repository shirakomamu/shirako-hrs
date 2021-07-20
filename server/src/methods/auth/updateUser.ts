import { SrkCookie } from "server/services/jwt";
import { IUpdateUserPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import updateUser from "server/services/auth0-mgmt/updateUser";
import { UpdateUserDto } from "common/dto/auth";
import { Role } from "common/enums/hrbac";
import hrbacCan from "common/utils/hrbacCan";

export default async (
  authResult: SrkCookie,
  { username, nickname, email }: UpdateUserDto
): Promise<IUpdateUserPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  // manual check for verified user for username and nickname
  if (username || nickname) {
    if (!hrbacCan({ roles: [Role._email_verified] }, authResult.actor)) {
      throw new SrkError("unauthorized");
    }
  }

  try {
    const response = await updateUser(authResult.actor.id, {
      username,
      nickname,
      email,
    });

    return response;
  } catch (e) {
    throw new SrkError("notAllowed");
  }
};
