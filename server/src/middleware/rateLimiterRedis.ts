import { Request, Response, NextFunction } from "express";
import { RateLimiterRes, RateLimiterRedis } from "rate-limiter-flexible";
import SrkError from "src/classes/SrkError";
import createRedis from "src/services/redis";

const POINTS = 1;

const rateLimiter = new RateLimiterRedis({
  storeClient: createRedis({
    keyPrefix: "middleware:",
  }),
  points: POINTS,
  duration: 1,
});

export default async (req: Request, res: Response, next: NextFunction) => {
  let result: RateLimiterRes;
  let doNext: boolean = true;
  try {
    result = await rateLimiter.consume(req.ip);
  } catch (e) {
    result = e;
    doNext = false;
  }

  res.header("Retry-After", (result.msBeforeNext / 1000).toString());
  res.header("X-RateLimit-Limit", POINTS.toString());
  res.header("X-RateLimit-Remaining", result.remainingPoints.toString());
  res.header(
    "X-RateLimit-Reset",
    new Date(Date.now() + result.msBeforeNext).toUTCString()
  );

  if (doNext) {
    next();
  } else {
    next(new SrkError("rateLimited"));
  }
};
