import { NuxtOptionsServerMiddleware } from "@nuxt/types/config/server-middleware";
import express from "express";
import cookieParser from "cookie-parser";

// Require authentication handler
import addUserData from "src/middleware/addUserData";
import initializeDb from "src/middleware/initializeDb";

import routes from "src/routes";

// Create express instance
const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // for signed cookies
app.use(cookieParser()); // for unsigned cookies

// Add authentication data
app.use(addUserData);

// make sure orm is loaded
app.use(initializeDb);

// Import API Routes
app.use(routes);

// Export express app
export default {
  path: "/api",
  handler: app,
} as NuxtOptionsServerMiddleware;
