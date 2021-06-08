import { AuthType } from "./jwt.enums";
import Actor from "src/classes/Actor";

export type SrkCookie = {
  authType: AuthType;
  actor?: Actor;
};
