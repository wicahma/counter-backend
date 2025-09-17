import express from "express";
import cors from "cors";
import adminRouter from "./routes/auth.router";
import queueRouter from "./routes/queue.router";
import { connectRedis } from "./configs/redis.config";
import { initializeCronJobs } from "./configs/queue.config";
import { MErrorHandler } from "./middlewares/error.middleware";

connectRedis();
initializeCronJobs();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", adminRouter);
app.use("/api/v1/queue", queueRouter);

app.use(MErrorHandler);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
