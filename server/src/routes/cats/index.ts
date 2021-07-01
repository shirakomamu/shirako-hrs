import { Router } from "express";
import { route } from "src/middleware/route";
import useSimpleGuard from "src/middleware/useSimpleGuard";
import { Role } from "src/services/hrbac";
import CatsController from "./cats.controller";

const catsController = new CatsController();
const router: Router = Router();

router.get("/", route(catsController.listCats));
router.get(
  "/guard1",
  [useSimpleGuard([Role._self_apis])],
  route(catsController.listCats)
);
router.get(
  "/guard1a",
  [useSimpleGuard([Role._self_apis, Role._acl_logs_view])],
  route(catsController.listCats)
);
router.get(
  "/guard2",
  [useSimpleGuard([Role._acl_logs_view])],
  route(catsController.listCats)
);
router.get(
  "/guard3",
  [useSimpleGuard([Role._self_profile])],
  route(catsController.listCats)
);
router.get(
  "/guard3a",
  [useSimpleGuard([Role._self_profile, Role._self_apis])],
  route(catsController.listCats)
);

export default router;
