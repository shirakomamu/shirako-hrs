import { Router } from "express";

// Send responses if it's available
import responseSender from "server/middleware/responseSender";

// API routes
import auth from "server/routes/auth";
import users from "server/routes/users";
import lists from "server/routes/lists";
import items from "server/routes/items";
import neurons from "server/routes/neurons";
import catchall from "server/routes/catchall";

const router: Router = Router();

router.use("/auth", auth);
router.use("/users", users);
router.use("/lists", lists);
router.use("/items", items);
router.use("/neurons", neurons);
router.use(responseSender);
router.use(catchall);

export default router;
