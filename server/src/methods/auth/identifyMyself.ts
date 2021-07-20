import { SrkCookie } from "server/services/jwt";
import { ISelfIdentifyPayload } from "common/types/api";
import getMemberFromActor from "server/methods/users/getMemberFromActor";

export default async (authResult: SrkCookie): Promise<ISelfIdentifyPayload> => {
  if (!authResult.actor) {
    return {};
  }

  // force internal registration upon identification
  await getMemberFromActor(authResult);

  return {
    actor: authResult.actor,
  };
};
