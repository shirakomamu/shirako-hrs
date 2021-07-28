import { NextFunction, Request, Response } from "express";
import { RateLimiterStoreAbstract } from "rate-limiter-flexible";
import { SrkExpressRequest, SrkExpressResponse } from "server/services/jwt";

type ConsumptionKeyGenerator = ({
  req,
  res,
}: {
  req: Request | SrkExpressRequest;
  res: Response | SrkExpressResponse;
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
