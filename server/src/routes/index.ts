import { Router } from "express";

// Rate limiter
import baseRateLimiter from "src/middleware/baseRateLimiter";

// Error catcher
import finalHandler from "src/middleware/finalHandler";

// API routes
import auth from "src/routes/auth";
import cats from "src/routes/cats";
import catchall from "src/routes/catchall";

const router: Router = Router();

router.use(baseRateLimiter);
router.use("/auth", auth);
router.use("/cats", cats);
router.use(catchall);
router.use(finalHandler);

export default router;
