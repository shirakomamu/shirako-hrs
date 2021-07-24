import SrkError from "server/classes/SrkError";
import { DI } from "server/middleware/initializeDi";
import { SrkCookie } from "server/services/jwt";

export default async (authResult: SrkCookie): Promise<void> => {
  if (!authResult.actor) {
    throw new SrkError("unauthorized");
  }
  const repo = DI.apiKeyRepo;

  const existingKey = await repo.findOne({
    owner: {
      sub: authResult.actor.id,
    },
  });

  if (!existingKey) {
    return;
  }

  await repo.removeAndFlush(existingKey);
};
