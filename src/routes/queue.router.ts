import { Router } from "express";
import { CClaimedQueue, CNextQueue } from "../controllers/queue.controller";
import { MAuthValidate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/claim", CClaimedQueue);

router.post("/next/:counter_id", MAuthValidate, CNextQueue);

export default router;
