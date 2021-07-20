import { NuxtOptionsServerMiddleware } from "@nuxt/types/config/server-middleware";
import express from "express";
import herokuSslRedirect from "heroku-ssl-redirect";

const app = express();

app.use(herokuSslRedirect());

export default {
  path: "/",
  handler: app,
} as NuxtOptionsServerMiddleware;
