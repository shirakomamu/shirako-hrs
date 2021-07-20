import { Request, Response, NextFunction } from "express";
import {
  BurstyRateLimiter,
  RateLimiterRes,
  RateLimiterRedis,
} from "rate-limiter-flexible";
import SrkError from "server/classes/SrkError";
import redisRl from "server/services/redis-rl";
import {
  BASE_POINTS,
  BASE_DURATION,
  BASE_BURST_POINTS,
  BASE_BURST_DURATION,
  BASE_SUBPREFIX,
  BASE_BURST_SUBPREFIX,
} from "server/config/rateLimiter";

const burstyLimiter = new BurstyRateLimiter(
  new RateLimiterRedis({
    storeClient: redisRl,
    keyPrefix: BASE_SUBPREFIX,
    points: BASE_POINTS,
    duration: BASE_DURATION,
  }),
  new RateLimiterRedis({
    storeClient: redisRl,
    keyPrefix: BASE_BURST_SUBPREFIX,
    points: BASE_BURST_POINTS,
    duration: BASE_BURST_DURATION,
  })
);

export default async (req: Request, res: Response, next: NextFunction) => {
  let result: RateLimiterRes;
  let doNext: boolean = true;
  try {
    result = await burstyLimiter.consume(req.ip);
  } catch (e) {
    result = e;
    doNext = false;
  }

  res.header("X-RateLimit-Limit", BASE_POINTS.toString());
  res.header("X-RateLimit-Remaining", result.remainingPoints.toString());
  res.header(
    "X-RateLimit-Reset",
    new Date(Date.now() + result.msBeforeNext).toUTCString()
  );

  if (doNext) {
    next();
  } else {
    res.header(
      "Retry-After",
      Math.round(result.msBeforeNext / 1000 || 1).toString()
    );
    next(new SrkError("rateLimited"));
  }
};
