import { Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
import useSimpleGuard from "server/middleware/useSimpleGuard";
import ListsController from "./lists.controller";
import {
  AddItemToDestinationListValidators,
  CreateDestinationListValidators,
  DeleteDestinationListValidators,
  EditDestinationListValidators,
  GetDestinationListValidators,
} from "./lists.validation";

const controller = new ListsController();
const router: Router = Router();

router.post(
  "/:username",
  [
    useSimpleGuard([Role._self_destination_lists]),
    ...CreateDestinationListValidators,
  ],
  route(controller.createDestinationList)
);

router.get(
  "/:username/:id",
  [...GetDestinationListValidators],
  route(controller.getDestinationList)
);

router.patch(
  "/:username/:id",
  [...EditDestinationListValidators],
  route(controller.editDestinationList)
);

router.delete(
  "/:username/:id",
  [...DeleteDestinationListValidators],
  route(controller.deleteDestinationList)
);

router.post(
  "/:username/:id/items/:destinationId",
  [
    useSimpleGuard([Role._self_destination_lists]),
    ...AddItemToDestinationListValidators,
  ],
  route(controller.addItemToList)
);

router.delete(
  "/:username/:id/items/:destinationId",
  [
    useSimpleGuard([Role._self_destination_lists]),
    ...AddItemToDestinationListValidators,
  ],
  route(controller.removeItemFromList)
);

export default router;
