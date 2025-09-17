import { Request } from "express";

export type methods = "GET" | "POST" | "PUT" | "DELETE";

export interface ICacheOptions {
  ttl?: number;
  keyPrefix?: string;
  skipCacheIf?: (req: Request) => boolean;
  invalidateOnMethods?: methods[];
}
