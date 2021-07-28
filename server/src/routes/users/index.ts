import { Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
import useSimpleGuard from "server/middleware/useSimpleGuard";
// import { authFail, authSlow } from "server/services/sub-rate-limiter";
// import subRateLimiterFactory from "server/services/sub-rate-limiter-factory";
import UsersController from "./users.controller";
import {
  CreateFriendValidators,
  DeleteFriendValidators,
  GetMemberValidators,
  SearchMembersValidators,
} from "./users.validation";

const controller = new UsersController();
const router: Router = Router();

router.get("/:username", [...GetMemberValidators], route(controller.getMember));

router.get(
  "/",
  [useSimpleGuard([Role._self_profile]), ...SearchMembersValidators],
  route(controller.searchMembersByUsername)
);

router.get(
  "/me/friends",
  [useSimpleGuard([Role._self_profile])],
  route(controller.getSelfFriendData)
);

router.post(
  "/me/friends",
  [useSimpleGuard([Role._self_friends]), ...CreateFriendValidators],
  route(controller.createFriendLink)
);

router.delete(
  "/me/friends",
  [useSimpleGuard([Role._self_friends]), ...DeleteFriendValidators],
  route(controller.deleteFriendLink)
);

export default router;
