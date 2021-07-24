import { ICreateApiKeyPayload } from "common/types/api";
import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { createKey } from "server/services/api-key";
import { SrkCookie } from "server/services/jwt";

export default async (authResult: SrkCookie): Promise<ICreateApiKeyPayload> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }
  const repo = DI.apiKeyRepo;
  const memberRepo = DI.memberRepo;

  const self = await memberRepo.findOneOrFail(
    {
      sub: authResult.actor.id,
    },
    ["apiKey"]
  );

  const generatedKey = await createKey(authResult.actor.id);

  if (self.apiKey) {
    self.apiKey.key = generatedKey.hash;

    await memberRepo.persistAndFlush(self);
  } else {
    const newKey = repo.create({
      key: generatedKey.hash,
    });

    self.apiKey = newKey;

    await memberRepo.persistAndFlush(self);
  }

  return {
    key: generatedKey.secret,
    createdAt: self.apiKey.updatedAt.getTime(),
  };
};
