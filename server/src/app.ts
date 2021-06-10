import { NuxtOptionsServerMiddleware } from "@nuxt/types/config/server-middleware";
import express from "express";
import cookieParser from "cookie-parser";
import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";

// Require orm to init
import ormService from "src/services/mikro-orm";
import Member, { IMember } from "src/services/mikro-orm/entities/Member";

// Require authentication handler
import addUserData from "src/middleware/addUserData";
import initializeDb from "src/middleware/initializeDb";

import routes from "src/routes";

// Create express instance
const app: express.Application = express();

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  memberRepo: EntityRepository<IMember>;
};

(async () => {
  DI.orm = await ormService;
  DI.em = DI.orm.em;
  DI.memberRepo = DI.orm.em.getRepository(Member);
  const migrator = DI.orm.getMigrator();
  await migrator.createMigration();
  await migrator.up();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(process.env.COOKIE_SECRET)); // for signed cookies
  app.use(cookieParser()); // for unsigned cookies

  // Add authentication data
  app.use(addUserData);

  // make sure orm is loaded
  app.use(initializeDb);

  // Import API Routes
  app.use(routes);
})();

// Export express app
export default {
  path: "/api",
  handler: app,
} as NuxtOptionsServerMiddleware;
