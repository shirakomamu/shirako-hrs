import { NuxtOptionsServerMiddleware } from "@nuxt/types/config/server-middleware";
import express from "express";
import auth0 from "src/middleware/auth0";
import addUserData from "src/middleware/addUserData";

// Create express instance
const app: express.Application = express();

// Add authentication data
app.use(auth0);
app.use(addUserData);

// Export express app
export default {
  path: "/",
  handler: app,
} as NuxtOptionsServerMiddleware;
