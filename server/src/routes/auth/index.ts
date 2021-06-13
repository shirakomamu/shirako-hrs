import { Router } from "express";

import { route } from "src/middleware/route";
import AuthController from "./auth.controller";
import {
  PageAuthValidators,
  RegisterNewMemberValidators,
} from "./auth.validation";

const authController = new AuthController();
const router: Router = Router();

router.post(
  "/pages",
  ...PageAuthValidators,
  route(authController.checkPageAccess)
);

router.post(
  "/register",
  ...RegisterNewMemberValidators,
  route(authController.registerNewMember)
);

export default router;
