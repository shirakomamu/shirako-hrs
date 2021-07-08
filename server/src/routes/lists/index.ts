import { Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
import useSimpleGuard from "server/middleware/useSimpleGuard";
// import { authFail, authSlow } from "server/services/sub-rate-limiter";
// import subRateLimiterFactory from "server/services/sub-rate-limiter-factory";
import ListsController from "./lists.controller";
import {} from "./lists.validation";
// import {} from "./auth.validation";

const listsController = new ListsController();
const router: Router = Router();

router.post(
  "/",
  [useSimpleGuard([Role._self_destination_lists])],
  route(listsController.createDestinationList)
);

export default router;
