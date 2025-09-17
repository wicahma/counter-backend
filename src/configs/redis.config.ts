import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "";

export const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis client error: ", err);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log("Redis connected Successfully.");
  } catch (e) {
    console.error("Failed to connect redis: ", e);
  }
};
