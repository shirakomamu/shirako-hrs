import express from "express";
import cookieParser from "cookie-parser";

// Require authentication handler
import addUserData from "./src/middleware/addUserData";

// API routes
import cats from "./src/routes/cats";

// Create express instance
const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET)); // for signed cookies
app.use(cookieParser()); // for unsigned cookies

// Add authentication data
app.use(addUserData);

// Import API Routes
app.use("/cats", cats);

// Export express app
export default app;
