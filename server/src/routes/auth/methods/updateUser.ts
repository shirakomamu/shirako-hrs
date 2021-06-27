import { SrkCookie } from "src/services/jwt";
import { IUpdateUserPayload } from "@@/common/interfaces/api";
import SrkError from "src/classes/SrkError";
import updateUser from "src/services/auth0-mgmt/updateUser";
import { UpdateUserDto } from "@@/common/dto/auth";
import hrbac, { Role } from "src/services/hrbac";

export default async (
  authResult: SrkCookie,
  { username, nickname, email }: UpdateUserDto
): Promise<IUpdateUserPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  // manual check for verified user for username and nickname
  if (username || nickname) {
    if (!hrbac.can({ roles: [Role._email_verified] }, authResult.actor)) {
      throw new SrkError("unauthorized");
    }
  }

  const response = await updateUser(authResult.actor.id, {
    username,
    nickname,
    email,
  });

  return response;
};
