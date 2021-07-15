import Actor from "server/classes/Actor";
import { AuthType } from "./jwt.enums";

export interface SrkCookie {
  authType: AuthType;
  actor?: Actor;
}
