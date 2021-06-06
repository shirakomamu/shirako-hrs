import { Router } from "express";
// import { body, param, query } from "express-validator";

import enforceRole from "@/src/middleware/enforceRole";
import { route } from "@/src/middleware/route";
import catsController from "./cats.controller";

const catsController = new CatsController();
const router: Router = Router();

router.post("/", [enforceRole()], route(catsController.createAccount));

export default router;
