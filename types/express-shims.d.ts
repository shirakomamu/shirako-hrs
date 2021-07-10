import { SrkCookie } from "server/services/jwt";

declare global {
  namespace Express {
    export interface Request {
      locals?: {
        authResult?: SrkCookie;
      };
    }
  }
}
