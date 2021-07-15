import { Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
import useSimpleGuard from "server/middleware/useSimpleGuard";
import ItemsController from "./items.controller";
import {} from "./items.validation";

const controller = new ItemsController();
const router: Router = Router();

router.get(
  "/identify/:id",
  [useSimpleGuard([Role._self_destination_lists])],
  route(controller.identifyDestination)
);

router.post(
  "/search",
  [useSimpleGuard([Role._self_destination_lists])],
  route(controller.searchForDestinations)
);

export default router;
