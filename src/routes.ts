// src/routes.ts
import { Router } from "express";
import { createRegistrationMonthlyController } from "./controllers/createRegistrationMonthlyController";
import { createRegistrationMonthlyMiddleware } from "./middlewares/createRegistrationMonthlyMiddleware";

const router = Router();

router.post(
  "/post",
  createRegistrationMonthlyMiddleware,
  createRegistrationMonthlyController
);

export default router;
