import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";
import SrkError from "server/classes/SrkError";
import initializeMember, { InitializedMemberData } from "./initializeMember";

export default async (
  authResult: SrkCookie
): Promise<InitializedMemberData> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.memberRepo;

  const existingMember = await repo.findOne({
    sub: authResult.actor.id,
  });

  if (existingMember)
    return {
      member: existingMember,
      actorDto: authResult.actor,
    };

  const { member, actorDto } = await initializeMember(authResult);

  return { member, actorDto };
};
