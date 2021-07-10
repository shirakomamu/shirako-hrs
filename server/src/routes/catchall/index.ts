import { Router } from "express";
import { route } from "server/middleware/route";
import CatchallController from "./catchall.controller";

const controller = new CatchallController();
const router: Router = Router();

router.all("*", route(controller.error404));

export default router;
