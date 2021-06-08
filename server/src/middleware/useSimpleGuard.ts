import { NextFunction, Request, Response } from "express";
import useGuard from "./useGuard";
import { enums as HrbacEnums } from "src/services/hrbac";
import { interfaces as JwtInterfaces } from "src/services/jwt";

export default (roles: HrbacEnums.Role[]) =>
  (
    req: Request,
    res: Response | JwtInterfaces.SrkExpressResponse,
    next: NextFunction
  ) => {
    return useGuard({ roles })(req, res, next);
  };
