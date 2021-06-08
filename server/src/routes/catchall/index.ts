import { Router } from "express";
import { route } from "src/middleware/route";
import CatchallController from "./catchall.controller";

const catchallController = new CatchallController();
const router: Router = Router();

router.all("*", route(catchallController.error404));

export default router;
