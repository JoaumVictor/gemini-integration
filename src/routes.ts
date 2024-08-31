import { Router } from "express";
import {
  createRegistrationMonthlyController,
  getAllMonthlyController,
} from "./controllers/createRegistrationMonthlyController";
import { createRegistrationMonthlyMiddleware } from "./middlewares/createRegistrationMonthlyMiddleware";
import { confirmMeasurementController } from "./controllers/confirmMeasurementController";
import { confirmMeasurementMiddleware } from "./middlewares/confirmMeasurementMiddleware";

const router = Router();

router.post(
  "/upload",
  createRegistrationMonthlyMiddleware,
  createRegistrationMonthlyController
);

router.get("/get", getAllMonthlyController);

router.patch(
  "/confirm",
  confirmMeasurementMiddleware,
  confirmMeasurementController
);

export default router;
