import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { vehicleController } from "./vehicle.controller";

const router = Router();

router.post("/", verifyToken(["admin"]), vehicleController.addVehicle);
router.get("/", verifyToken(["admin"]), vehicleController.getAllVehicles);
router.get("/:vehicleId", vehicleController.getVehicleById);
router.put(
  "/:vehicleId",
  verifyToken(["admin"]),
  vehicleController.updateVehicle
);
router.delete(
  "/:vehicleId",
  verifyToken(["admin"]),
  vehicleController.deleteVehicle
);

export const vehicleRoutes = router;
