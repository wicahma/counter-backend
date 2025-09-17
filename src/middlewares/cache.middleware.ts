import { NextFunction, Request, Response } from "express";
import { ICacheOptions, methods } from "../interfaces/cache.interface";
import crypto from "crypto";
import { redisClient } from "../configs/redis.config";

export const MCache = ({
  invalidateOnMethods = ["POST", "PUT", "DELETE"],
  keyPrefix = "api_cache",
  skipCacheIf,
  ttl = 300,
}: ICacheOptions) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // logic untuk menyimpan dan memanipulasi data response yang akan di cache

      if (invalidateOnMethods.includes(req.method as methods)) {
        return next();
      }

      if (skipCacheIf && skipCacheIf(req)) {
        return next();
      }

      const cacheKey = generateCacheKey(req, keyPrefix);

      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        const parsed = JSON.parse(cachedData);

        res.setHeader("X-Cache-Status", "HIT");
        res.setHeader("X-Cache-Key", cacheKey);

        return res.status(parsed.status).json(parsed.body);
      }

      const originalSend = res.send;
      res.send = function (data: any) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const cacheData = {
            statusCode: res.statusCode,
            data: JSON.parse(data),
            timestamp: Date.now(),
          };

          setImmediate(async () => {
            try {
              await redisClient.setEx(cacheKey, ttl, JSON.stringify(cacheData));
            } catch (error) {
              console.log("Error when trying to save data to cache: ", error);
            }
          });
        }

        res.setHeader("X-Cache-Status", "MISS");
        res.setHeader("X-Cache-Key", cacheKey);

        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.log("Error when trying to cache data: ", error);
      next();
    }
  };
};

const generateCacheKey = (req: Request, prefix: string): string => {
  const url = req.originalUrl || req.url;
  const method = req.method;
  const userAgent = req.headers["user-agent"] || "";

  const keyData = {
    method,
    url,
    userId: "annonymous",
    userAgent: crypto
      .createHash("md5")
      .update(userAgent)
      .digest("hex")
      .substring(0, 8),
  };

  const keystring = JSON.stringify(keyData);
  const hash = crypto.createHash("md5").update(keystring).digest("hex");

  return `${prefix}${hash}}`;
};

export const MInvalidateCache = (patterns: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const originalJson = res.json;
      res.json = function (data: any) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setImmediate(async () => {
            try {
              await invalidateCachePattern(patterns);
            } catch (error) {
              console.error("Cache invalidation error:", error);
            }
          });
        }

        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error("Cache invalidation middleware error:", error);
      next();
    }
  };
};

const invalidateCachePattern = async (patterns: string[]): Promise<void> => {
  if (patterns.length <= 0) return;

  for (const pattern of patterns) {
    try {
      const key = await redisClient.get(pattern);

      if (key) {
        await redisClient.del(key);
        console.log(`Cache with pattern ${pattern}, has been deleted!`);
      }
    } catch (error) {
      console.log(`Error when trying to delete key ${pattern}: `, error);
    }
  }
};

export const CachePresets = {
  short: (ttl: number = 60): ICacheOptions => ({
    ttl,
    keyPrefix: "short_cache",
  }),

  medium: (ttl: number = 300): ICacheOptions => ({
    ttl,
    keyPrefix: "medium_cache",
  }),

  long: (ttl: number = 3600): ICacheOptions => ({
    ttl,
    keyPrefix: "long_cache",
  }),

  user: (ttl: number = 600): ICacheOptions => ({
    ttl,
    keyPrefix: "user_cache",
  }),
};
