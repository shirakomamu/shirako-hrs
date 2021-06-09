// import fs from "fs";
import { MikroORM } from "@mikro-orm/core";
import { BaseEntity, ApiKey, Member } from "./entities";

// async function getEntities(): Promise<any[]> {
//   if (process.env.WEBPACK) {
//     const modules = require.context(
//       "server/src/services/mikro-orm/entities",
//       true,
//       /\.ts$/
//     );

//     return modules
//       .keys()
//       .map((r) => modules(r))
//       .flatMap((mod) => Object.keys(mod).map((className) => mod[className]));
//   }

//   const promises = fs
//     .readdirSync("server/src/services/mikro-orm/entities")
//     .map((file) => import(`server/src/services/mikro-orm/entities/${file}`));
//   const modules = await Promise.all(promises);

//   return modules.flatMap((mod) =>
//     Object.keys(mod).map((className) => mod[className])
//   );
// }

// getEntities();

const orm = MikroORM.init({
  entities: [BaseEntity, ApiKey, Member],
  type: "postgresql", // or 'sqlite' or 'postgresql' or 'mariadb'
  clientUrl: process.env.DATABASE_URL,
  pool: {
    max: 10,
  },
  discovery: { disableDynamicFileAccess: true },
});

export default orm;
