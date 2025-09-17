import { Router } from "express";
import {
  CLogin,
  CCreateAdmin,
  CUpdateAdmin,
  CDeleteAdmin,
  CGetAllAdmins,
} from "../controllers/auth.controller";
import {
  CachePresets,
  MCache,
  MInvalidateCache,
} from "../middlewares/cache.middleware";
import { MAuthValidate } from "../middlewares/auth.middleware";

const router = Router();

router.post("/login", CLogin);

router.post(
  "/create",
  MInvalidateCache(["medium_cache:*"]),
  MAuthValidate,
  CCreateAdmin
);

router.put(
  "/:id",
  MInvalidateCache(["medium_cache:*"]),
  MAuthValidate,
  CUpdateAdmin
);

router.delete(
  "/:id",
  MInvalidateCache(["medium_cache:*"]),
  MAuthValidate,
  CDeleteAdmin
);

router.get("/", MCache(CachePresets.medium(300)), MAuthValidate, CGetAllAdmins);

export default router;
