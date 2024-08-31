import { Router } from "express";
import {
  createRegistrationMonthlyController,
  getAllMonthlyController,
} from "./controllers/createRegistrationMonthlyController";
import { createRegistrationMonthlyMiddleware } from "./middlewares/createRegistrationMonthlyMiddleware";
import { confirmMeasurementController } from "./controllers/confirmMeasurementController";
import { confirmMeasurementMiddleware } from "./middlewares/confirmMeasurementMiddleware";
import { getMeasurementsController } from "./controllers/getMeasurementsController";

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

router.get("/:customer_code/list", getMeasurementsController);

export default router;
