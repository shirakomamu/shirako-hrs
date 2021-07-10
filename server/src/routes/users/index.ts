import { Router } from "express";
import { route } from "server/middleware/route";
// import { authFail, authSlow } from "server/services/sub-rate-limiter";
// import subRateLimiterFactory from "server/services/sub-rate-limiter-factory";
import UsersController from "./users.controller";

const controller = new UsersController();
const router: Router = Router();

router.get("/:username", route(controller.getMember));

export default router;
