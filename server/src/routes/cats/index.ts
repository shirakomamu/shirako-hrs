import { Router } from "express";
import { query } from "express-validator";

import { route } from "src/middleware/route";
import useSimpleGuard from "src/middleware/useSimpleGuard";
import { Role } from "src/services/hrbac";
import CatsController from "./cats.controller";

const catsController = new CatsController();
const router: Router = Router();

router.get("/", [], route(catsController.listCats));
router.get(
  "/guarded",
  [useSimpleGuard([Role._self_profile])],
  route(catsController.listCats)
);
router.get(
  "/validated",
  [query("test").exists()],
  route(catsController.listCats)
);
router.post(
  "/",
  [useSimpleGuard([Role._self_profile])],
  route(catsController.listCats)
);

export default router;
