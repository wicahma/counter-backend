import { Router } from "express";
import {
  CLogin,
  CCreateAdmin,
  CUpdateAdmin,
  CDeleteAdmin,
} from "../controllers/auth.controller";

const router = Router();

router.post("/login", CLogin);

router.post("/create", CCreateAdmin);

router.put("/:id", CUpdateAdmin);

router.delete("/:id", CDeleteAdmin);

export default router;
