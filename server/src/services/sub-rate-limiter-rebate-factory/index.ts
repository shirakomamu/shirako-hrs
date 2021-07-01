import { NextFunction, Request, Response } from "express";
import { RateLimiterStoreAbstract } from "rate-limiter-flexible";

type ConsumptionKeyGenerator = ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}) => string;

interface SubRateLimiterFactoryOptions {
  rateLimiter: RateLimiterStoreAbstract;
  ckGen: ConsumptionKeyGenerator;
}

export default (opts: SubRateLimiterFactoryOptions[]) => {
  return async (req: Request, res: Response, next?: NextFunction) => {
    const limiters = opts.map((e) => e.rateLimiter);
    await Promise.allSettled(
      limiters.map((e, i) => e.reward(opts[i].ckGen({ req, res })))
    );

    if (next) next();
  };
};
