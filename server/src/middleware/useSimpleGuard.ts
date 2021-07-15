import { Role } from "common/enums/hrbac";
import { NextFunction, Request, Response } from "express";
import { SrkExpressRequest } from "server/services/jwt";
import useGuard from "./useGuard";

export default (roles: Role[]) =>
  (req: Request | SrkExpressRequest, res: Response, next: NextFunction) => {
    return useGuard({ roles })(req, res, next);
  };
