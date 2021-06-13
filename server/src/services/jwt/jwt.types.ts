import Actor from "src/classes/Actor";
import { AuthType } from "./jwt.enums";

export type SrkCookie = {
  authType: AuthType;
  actor?: Actor;
};
