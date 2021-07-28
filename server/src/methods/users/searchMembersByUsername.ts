import { SearchMembersDto } from "common/dto/users";
import { ISearchUsersPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { searchForUsersByUsernameOrNickname } from "server/services/auth0-mgmt/getUserByUsername";
import { SrkCookie } from "server/services/jwt";
import _mapAuth0ToIdentity from "./_mapAuth0ToIdentity";

export default async (
  authResult: SrkCookie,
  { keyword }: SearchMembersDto
): Promise<ISearchUsersPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const targetUsers = await searchForUsersByUsernameOrNickname(keyword);

  return {
    users: targetUsers.map((e) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = _mapAuth0ToIdentity(e);

      return rest;
    }),
  };
};
