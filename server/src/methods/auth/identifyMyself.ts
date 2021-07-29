import { SrkCookie } from "server/services/jwt";
import { ISelfIdentifyPayload } from "common/types/api";
import getMemberFromActor from "server/methods/users/_getMemberFromActor";
import Actor from "server/classes/Actor";

export default async (authResult: SrkCookie): Promise<ISelfIdentifyPayload> => {
  if (!authResult.actor) {
    return {};
  }

  // force internal registration upon identification
  const { actorDto } = await getMemberFromActor(authResult);

  return {
    actor: new Actor(actorDto),
  };
};
