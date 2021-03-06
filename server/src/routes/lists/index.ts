import { Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
import useSimpleGuard from "server/middleware/useSimpleGuard";
import ListsController from "./lists.controller";
import {
  AddItemToDestinationListValidators,
  AddUserToDestinationListValidators,
  CreateDestinationListValidators,
  DeleteDestinationListValidators,
  EditDestinationListValidators,
  GetDestinationListValidators,
  GetListsOfInterestValidators,
  RemoveItemFromDestinationListValidators,
  RemoveUserFromDestinationListValidators,
  SearchDestinationListsValidators,
} from "./lists.validation";

const controller = new ListsController();
const router: Router = Router();

router.get(
  "/",
  [
    useSimpleGuard([Role._self_destination_lists]), // used by dashboard
    ...SearchDestinationListsValidators,
  ],
  route(controller.searchDestinationLists)
);

// does NOT get user's lists, but rather lists shared with them and friends' lists (so it validates username is self)
router.get(
  "/:username",
  [useSimpleGuard([Role._self_profile]), ...GetListsOfInterestValidators],
  route(controller.getListsOfInterest)
);

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
  [
    useSimpleGuard([Role._self_profile]), // to see
    ...GetDestinationListValidators,
  ],
  route(controller.getDestinationList)
);

router.patch(
  "/:username/:id",
  [
    useSimpleGuard([Role._self_destination_lists]),
    ...EditDestinationListValidators,
  ],
  route(controller.editDestinationList)
);

router.delete(
  "/:username/:id",
  [
    useSimpleGuard([Role._self_destination_lists]),
    ...DeleteDestinationListValidators,
  ],
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
    ...RemoveItemFromDestinationListValidators,
  ],
  route(controller.removeItemFromList)
);

router.post(
  "/:username/:id/users/:targetUsername",
  [
    useSimpleGuard([Role._self_destination_lists]),
    ...AddUserToDestinationListValidators,
  ],
  route(controller.addUserToList)
);

router.delete(
  "/:username/:id/users/:targetUsername",
  [
    useSimpleGuard([Role._self_destination_lists]),
    ...RemoveUserFromDestinationListValidators,
  ],
  route(controller.removeUserFromList)
);

export default router;
