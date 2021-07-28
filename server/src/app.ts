import { NuxtOptionsServerMiddleware } from "@nuxt/types/config/server-middleware";
import express from "express";
import cookieParser from "cookie-parser";

// Require middlewares
import baseRateLimiter from "server/middleware/baseRateLimiter";
import initializeDi, { DI } from "server/middleware/initializeDi";
import initializeDb from "server/middleware/initializeDb";
import auth0 from "server/middleware/auth0";
import addUserData from "server/middleware/addUserData";
import preErrorHandler from "server/middleware/preErrorHandler";
import finalHandler from "server/middleware/finalHandler";

// Routes
import routes from "server/routes";

// Re-export DI
export { DI };

// Create express instance
const app: express.Application = express();

app.use(baseRateLimiter);
app.use(initializeDi);
app.use(initializeDb);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET)); // for signed cookies
// app.use(cookieParser()); // for unsigned cookies

// Add authentication data
app.use(auth0);
app.use(addUserData);
app.use(preErrorHandler);

// Import API Routes
app.use(routes);

app.use(finalHandler);

// Export express app
export default {
  path: "/api",
  handler: app,
} as NuxtOptionsServerMiddleware;
