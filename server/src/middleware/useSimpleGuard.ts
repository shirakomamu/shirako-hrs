import { Role } from "@@/common/enums/hrbac";
import { NextFunction, Request, Response } from "express";
import { SrkExpressResponse } from "src/services/jwt";
import useGuard from "./useGuard";

export default (roles: Role[]) =>
  (req: Request, res: Response | SrkExpressResponse, next: NextFunction) => {
    return useGuard({ roles })(req, res, next);
  };
