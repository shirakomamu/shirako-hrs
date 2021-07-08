import { Router } from "express";

// Rate limiter
import baseRateLimiter from "server/middleware/baseRateLimiter";

// Error catcher
import responseSender from "server/middleware/responseSender";
import finalHandler from "server/middleware/finalHandler";

// API routes
import auth from "server/routes/auth";
import cats from "server/routes/cats";
import catchall from "server/routes/catchall";

const router: Router = Router();

router.use(baseRateLimiter);
router.use("/auth", auth);
router.use("/cats", cats);
router.use(responseSender);
router.use(catchall);
router.use(finalHandler);

export default router;
