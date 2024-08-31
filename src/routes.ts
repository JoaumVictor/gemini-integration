// src/routes.ts
import { Router } from "express";
import {
  createRegistrationMonthlyController,
  getAllMonthlyController,
} from "./controllers/createRegistrationMonthlyController";
import { createRegistrationMonthlyMiddleware } from "./middlewares/createRegistrationMonthlyMiddleware";

const router = Router();

router.post(
  "/upload",
  createRegistrationMonthlyMiddleware,
  createRegistrationMonthlyController
);

router.get("/get", getAllMonthlyController);

export default router;
