import Actor from "server/classes/Actor";
import { AuthType } from "./jwt.enums";

export type SrkCookie = {
  authType: AuthType;
  actor?: Actor;
};
