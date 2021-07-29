import { DI } from "server/middleware/initializeDi";
import updateUser from "server/services/auth0-mgmt/updateUser";
import { SrkCookie } from "server/services/jwt";
import SrkError from "server/classes/SrkError";
import transformUserToActor from "server/services/auth0-mgmt/transformUserToActor";
import { ActorConstructorDto } from "common/dto/auth";
import { Member } from "server/entities/Member";

export interface InitializedMemberData {
  actorDto: ActorConstructorDto;
  member: Member;
}

export default async (
  authResult: SrkCookie
): Promise<InitializedMemberData> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }

  const repo = DI.memberRepo;

  const member = repo.create({
    sub: authResult.actor.id,
  });

  const user = await updateUser(authResult.actor.id, {
    nickname: authResult.actor.username,
    app_metadata: {
      hrs: {
        rgs: [],
      },
    },
  });

  await repo.persistAndFlush(member);

  return {
    actorDto: transformUserToActor(user),
    member,
  };
};
