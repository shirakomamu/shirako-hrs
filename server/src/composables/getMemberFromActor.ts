import { DI } from "server/middleware/initializeDi";
import { Member } from "server/entities/Member";
import Actor from "server/classes/Actor";

export default async (actor: Actor): Promise<Member> => {
  const repo = DI.memberRepo;

  const existingMember = await repo.findOne({
    sub: {
      $eq: actor.id,
    },
  });

  if (existingMember) return existingMember;

  const member = repo.create({
    sub: actor.id,
  });

  await repo.persistAndFlush(member);

  return member;
};
