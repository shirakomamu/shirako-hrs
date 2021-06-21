import { NuxtOptionsServerMiddleware } from "@nuxt/types/config/server-middleware";
import express from "express";
import cookieParser from "cookie-parser";

// Require middlewares
import initializeDi, { DI } from "src/middleware/initializeDi";
import initializeDb from "src/middleware/initializeDb";
import auth0 from "src/middleware/auth0";
import addUserData from "src/middleware/addUserData";
import preErrorHandler from "src/middleware/preErrorHandler";

// Routes
import routes from "src/routes";

// Re-export DI
export { DI };

// Create express instance
const app: express.Application = express();

app.use(initializeDi);
app.use(initializeDb);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET)); // for signed cookies
app.use(cookieParser()); // for unsigned cookies

// Add authentication data
app.use(auth0);
app.use(addUserData);
app.use(preErrorHandler);

// Import API Routes
app.use(routes);

// Export express app
export default {
  path: "/api",
  handler: app,
} as NuxtOptionsServerMiddleware;
