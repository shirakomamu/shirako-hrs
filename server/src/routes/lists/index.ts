import { Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
import useSimpleGuard from "server/middleware/useSimpleGuard";
import ListsController from "./lists.controller";
import {} from "./lists.validation";

const controller = new ListsController();
const router: Router = Router();

router.post(
  "/:username",
  [useSimpleGuard([Role._self_destination_lists])],
  route(controller.createDestinationList)
);

router.get("/:username/:id", route(controller.getDestinationList));

export default router;
