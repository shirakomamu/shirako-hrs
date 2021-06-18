import { Router } from "express";
import { route } from "src/middleware/route";
import { authFail, authSlow } from "src/services/sub-rate-limiter";
import subRateLimiterFactory from "src/services/sub-rate-limiter-factory";
import AuthController from "./auth.controller";
import {
  NameCheckValidators,
  OtpTokenValidators,
  PageAuthValidators,
  RegisterNewMemberValidators,
} from "./auth.validation";

const authController = new AuthController();
const router: Router = Router();

// const loginRateLimiter = subRateLimiterFactory([
//   {
//     rateLimiter: authSlow,
//     ckGen: ({ req }) => req.ip,
//   },
//   {
//     rateLimiter: authFail,
//     ckGen: ({ req }) => req.ip + "_" + req.body.user,
//   },
// ]);

router.post(
  "/pages",
  ...PageAuthValidators,
  route(authController.checkPageAccess)
);

router.post(
  "/register",
  ...RegisterNewMemberValidators,
  route(
    authController.registerNewMember,
    subRateLimiterFactory([
      {
        rateLimiter: authSlow,
        ckGen: ({ req }) => req.ip,
      },
      {
        rateLimiter: authFail,
        ckGen: ({ req }) => req.ip + "_un_" + req.body.username,
      },
      {
        rateLimiter: authFail,
        ckGen: ({ req }) => req.ip + "_dn_" + req.body.displayName,
      },
    ])
  )
);

router.post(
  "/register/token",
  ...OtpTokenValidators,
  route(
    authController.checkOtpToken,
    subRateLimiterFactory([
      {
        rateLimiter: authSlow,
        ckGen: ({ req }) => req.ip,
      },
    ])
  )
);

router.post(
  "/ncheck",
  ...NameCheckValidators,
  route(
    authController.isNameAvailable,
    subRateLimiterFactory([
      {
        rateLimiter: authSlow,
        ckGen: ({ req }) => req.ip,
      },
      {
        rateLimiter: authFail,
        ckGen: ({ req }) => req.ip + "_" + req.body.type + "_" + req.body.name,
      },
    ])
  )
);

export default router;
