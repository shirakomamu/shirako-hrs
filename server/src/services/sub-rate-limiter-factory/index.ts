import { Request, Response, NextFunction } from "express";
import { RateLimiterStoreAbstract } from "rate-limiter-flexible";
import SrkError from "server/classes/SrkError";
import {
  SrkExpressRequest,
  SrkExpressResponse,
  WithSrkExpressResponse,
} from "../jwt";

type ConsumptionKeyGenerator = ({
  req,
  res,
}: {
  req: Request | SrkExpressRequest;
  res: Response | SrkExpressResponse | WithSrkExpressResponse;
}) => string;

interface SubRateLimiterFactoryOptions {
  rateLimiter: RateLimiterStoreAbstract;
  ckGen: ConsumptionKeyGenerator;
}

export default (opts: SubRateLimiterFactoryOptions[]) => {
  return async (req: Request, res: Response, next?: NextFunction) => {
    const limiters = opts.map((e) => e.rateLimiter);

    const results = await Promise.allSettled(
      limiters.map((e, i) => e.consume(opts[i].ckGen({ req, res })))
    );

    for (let i = 0; i < limiters.length; i++) {
      if (results[i].status === "rejected") {
        const result = results[i] as PromiseRejectedResult;

        res.header(
          "Retry-After",
          (Math.round(result.reason.msBeforeNext / 1000) || 1).toString()
        );

        if (next) return next(new SrkError("rateLimited"));
      }
    }

    if (next) return next();
  };
};
