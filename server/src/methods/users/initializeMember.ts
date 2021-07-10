import { DI } from "server/middleware/initializeDi";
import { Member } from "server/entities/Member";
import updateUser from "server/services/auth0-mgmt/updateUser";
import { SrkCookie } from "server/services/jwt";
import SrkError from "server/classes/SrkError";

export default async (authResult: SrkCookie): Promise<Member> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.memberRepo;

  const member = repo.create({
    sub: authResult.actor.id,
  });

  await updateUser(authResult.actor.id, {
    app_metadata: {
      hrs: {
        rgs: [],
      },
    },
  });

  await repo.persistAndFlush(member);

  return member;
};
