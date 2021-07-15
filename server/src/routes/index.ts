import { Router } from "express";

// Error catcher
import responseSender from "server/middleware/responseSender";
import finalHandler from "server/middleware/finalHandler";

// API routes
import auth from "server/routes/auth";
import users from "server/routes/users";
import lists from "server/routes/lists";
import items from "server/routes/items";
import cats from "server/routes/cats";
import catchall from "server/routes/catchall";

const router: Router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/lists", lists);
router.use("/items", items);
router.use("/cats", cats);
router.use(responseSender);
router.use(catchall);
router.use(finalHandler);

export default router;
