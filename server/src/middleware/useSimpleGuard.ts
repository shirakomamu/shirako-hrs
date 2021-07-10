import { Role } from "common/enums/hrbac";
import { NextFunction, Request } from "express";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";
import useGuard from "./useGuard";

export default (roles: Role[]) =>
  (
    req: Request | SrkExpressRequest,
    res: SrkExpressResponse,
    next: NextFunction
  ) => {
    return useGuard({ roles })(req, res, next);
  };
