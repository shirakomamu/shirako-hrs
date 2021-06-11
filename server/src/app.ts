import { NuxtOptionsServerMiddleware } from "@nuxt/types/config/server-middleware";
import express from "express";
import cookieParser from "cookie-parser";
import { EntityRepository, MikroORM } from "@mikro-orm/core";
import { EntityManager } from "@mikro-orm/postgresql";

// Require orm to init
import ormService from "src/services/mikro-orm";
import Member, { IMember } from "src/services/mikro-orm/entities/Member";

// Require middlewares
import preErrorHandler from "src/middleware/preErrorHandler";
import addUserData from "src/middleware/addUserData";
import initializeDb from "src/middleware/initializeDb";

import routes from "src/routes";

// Create express instance
const app: express.Application = express();

export const DI = {} as {
  orm: Promise<MikroORM>;
  em: EntityManager;
  memberRepo: EntityRepository<IMember>;
};

(async () => {
  DI.orm = ormService;
  DI.em = (await DI.orm).em as EntityManager;
  DI.memberRepo = DI.em.getRepository(Member);
  const migrator = (await DI.orm).getMigrator();
  await migrator.createMigration();
  await migrator.up();
})();
app.use(initializeDb);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET)); // for signed cookies
app.use(cookieParser()); // for unsigned cookies

// Add authentication data
app.use(addUserData);
app.use(preErrorHandler);

// Import API Routes
app.use(routes);

// Export express app
export default {
  path: "/api",
  handler: app,
} as NuxtOptionsServerMiddleware;
