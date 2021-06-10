import { Router } from "express";

// Error catcher
import errorHandler from "src/middleware/errorHandler";

// API routes
import auth from "src/routes/auth";
import cats from "src/routes/cats";
import catchall from "src/routes/catchall";

const router: Router = Router();

router.use("/cats", cats);
router.use("/auth", auth);
router.use(catchall);
router.use(errorHandler);

export default router;
