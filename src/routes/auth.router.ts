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

const router = Router();

router.post("/login", CLogin);

router.post("/create", MInvalidateCache(["medium_cache:*"]), CCreateAdmin);

router.put("/:id", MInvalidateCache(["medium_cache:*"]), CUpdateAdmin);

router.delete("/:id", MInvalidateCache(["medium_cache:*"]), CDeleteAdmin);

router.get("/", MCache(CachePresets.medium(300)), CGetAllAdmins);

export default router;
