// import { Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
// import useSimpleGuard from "server/middleware/useSimpleGuard";
import CatsController from "./cats.controller";

const controller = new CatsController();
const router: Router = Router();

router.get("/", route(controller.listCats));
// router.get(
//   "/guard1",
//   [useSimpleGuard([Role._self_apis])],
//   route(controller.listCats)
// );
// router.get(
//   "/guard1a",
//   [useSimpleGuard([Role._self_apis, Role._acl_logs_view])],
//   route(controller.listCats)
// );
// router.get(
//   "/guard2",
//   [useSimpleGuard([Role._acl_logs_view])],
//   route(controller.listCats)
// );
// router.get(
//   "/guard3",
//   [useSimpleGuard([Role._self_profile])],
//   route(controller.listCats)
// );
// router.get(
//   "/guard3a",
//   [useSimpleGuard([Role._self_profile, Role._self_apis])],
//   route(controller.listCats)
// );

export default router;
