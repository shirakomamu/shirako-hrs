import { GuardBehavior, Role } from "common/enums/hrbac";
import { Router } from "express";
import { route } from "server/middleware/route";
import useGuard from "server/middleware/useGuard";
import useSimpleGuard from "server/middleware/useSimpleGuard";
// import { authFail, authSlow } from "server/services/sub-rate-limiter";
// import subRateLimiterFactory from "server/services/sub-rate-limiter-factory";
import AuthController from "./auth.controller";
import {
  UpdateUserPreferencesValidators,
  UpdateUserValidators,
} from "./auth.validation";
// import {} from "./auth.validation";

const authController = new AuthController();
const router: Router = Router();

router.get("/login", (_req, res) =>
  res.oidc.login({ returnTo: process.env.SERVER_BASE_URI })
);
router.get("/logout", (_req, res) =>
  res.oidc.logout({ returnTo: process.env.SERVER_BASE_URI })
);

router.get("/me", route(authController.identifyMyself));
router.patch(
  "/me",
  [useSimpleGuard([Role._self_profile]), ...UpdateUserValidators],
  route(authController.updateUser)
);
router.delete(
  "/me",
  [useSimpleGuard([Role._self_profile])],
  route(authController.deleteUser)
);
router.patch(
  "/me/preferences",
  [useSimpleGuard([Role._email_verified]), ...UpdateUserPreferencesValidators],
  route(authController.updateUserPreferences)
);

router.post(
  "/me/verify_email",
  [
    useGuard({
      roles: [],
      guards: [
        {
          roles: [Role._email_verified],
          mode: GuardBehavior.notAll,
        },
        {
          roles: [Role._self_profile],
          mode: GuardBehavior.all,
        },
      ],
      mode: GuardBehavior.all,
    }),
  ],
  route(authController.resendVerificationEmail)
);
router.post(
  "/me/reset_password",
  [useSimpleGuard([Role._self_profile])],
  route(authController.sendPasswordResetEmail)
);

// router.post(
//   "/register",
//   ...RegisterNewMemberValidators,
//   route(
//     authController.registerNewMember,
//     subRateLimiterFactory([
//       {
//         rateLimiter: authSlow,
//         ckGen: ({ req }) => req.ip,
//       },
//       {
//         rateLimiter: authFail,
//         ckGen: ({ req }) => req.ip + "_un_" + req.body.username,
//       },
//       {
//         rateLimiter: authFail,
//         ckGen: ({ req }) => req.ip + "_dn_" + req.body.displayName,
//       },
//     ])
//   )
// );

// router.post(
//   "/register/token",
//   ...OtpTokenValidators,
//   route(
//     authController.checkOtpToken,
//     subRateLimiterFactory([
//       {
//         rateLimiter: authSlow,
//         ckGen: ({ req }) => req.ip,
//       },
//     ])
//   )
// );

// router.post(
//   "/ncheck",
//   ...NameCheckValidators,
//   route(
//     authController.isNameAvailable,
//     subRateLimiterFactory([
//       {
//         rateLimiter: authSlow,
//         ckGen: ({ req }) => req.ip,
//       },
//       {
//         rateLimiter: authFail,
//         ckGen: ({ req }) => req.ip + "_" + req.body.type + "_" + req.body.name,
//       },
//     ])
//   )
// );

export default router;
