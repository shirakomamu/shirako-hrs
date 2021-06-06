import { types as GuardTypes } from "server/src/services/guard";

export type PageMap = {
  [key: string]: GuardTypes.Guard;
};
