import { Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
import useSimpleGuard from "server/middleware/useSimpleGuard";
import NeuronsController from "./neurons.controller";
import { ActivateNeuronsValidators } from "./neurons.validation";

const controller = new NeuronsController();
const router: Router = Router();

router.post(
  "/activate",
  [useSimpleGuard([Role._email_verified]), ...ActivateNeuronsValidators],
  route(controller.activateNeurons)
);

export default router;
