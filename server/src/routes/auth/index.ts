import { Router } from "express";
import { checkSchema } from "express-validator";

import { route } from "src/middleware/route";
import AuthController from "./auth.controller";
import { RegisterNewMemberSchema } from "./auth.validation";

const authController = new AuthController();
const router: Router = Router();

router.post(
  "/register",
  checkSchema(RegisterNewMemberSchema),
  route(authController.registerNewMember)
);

export default router;
