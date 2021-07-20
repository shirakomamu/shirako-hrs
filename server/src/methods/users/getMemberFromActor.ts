import { DI } from "server/middleware/initializeDi";
import { Member } from "server/entities/Member";
import { SrkCookie } from "server/services/jwt";
import SrkError from "server/classes/SrkError";
import initializeInternalMember from "./initializeMember";

export default async (authResult: SrkCookie): Promise<Member> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.memberRepo;

  const existingMember = await repo.findOne({
    sub: authResult.actor.id,
  });

  if (existingMember) return existingMember;

  return await initializeInternalMember(authResult);
};
