import { MikroORM } from "@mikro-orm/core";
import BaseEntity from "./entities/BaseEntity";

const orm = MikroORM.init({
  entities: [BaseEntity],
  type: "postgresql", // or 'sqlite' or 'postgresql' or 'mariadb'
  clientUrl: process.env.DATABASE_URL,
  pool: {
    max: 10,
  },
});

export default orm;
