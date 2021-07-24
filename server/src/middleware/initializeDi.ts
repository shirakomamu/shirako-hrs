import { Request, Response, NextFunction } from "express";
import { EntityRepository, MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";
import ormService, { storage } from "server/services/mikro-orm";
import { Member } from "server/entities/Member";
import { DestinationList } from "server/entities/DestinationList";
import { Destination } from "server/entities/Destination";
import { ApiKey } from "server/entities/ApiKey";

export const DI = {} as {
  orm: Promise<MikroORM>;
  em: EntityManager;
  apiKeyRepo: EntityRepository<ApiKey>;
  memberRepo: EntityRepository<Member>;
  destinationListRepo: EntityRepository<DestinationList>;
  destinationItemRepo: EntityRepository<Destination>;
};

let initialized: boolean = false;

DI.orm = ormService;

// Require orm to init
export default async (_req: Request, _res: Response, next: NextFunction) => {
  if (!initialized) {
    const migrator = (await DI.orm).getMigrator();
    if (process.env.NODE_ENV !== "production") {
      await migrator.createMigration();
    }
    await migrator.up();

    DI.em = (await DI.orm).em as EntityManager;
    DI.apiKeyRepo = DI.em.getRepository(ApiKey);
    DI.memberRepo = DI.em.getRepository(Member);
    DI.destinationListRepo = DI.em.getRepository(DestinationList);
    DI.destinationItemRepo = DI.em.getRepository(Destination);

    initialized = true;
  }
  storage.run((await DI.orm).em.fork(true, true), next);
};
