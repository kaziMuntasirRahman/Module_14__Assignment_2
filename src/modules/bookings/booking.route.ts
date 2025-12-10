import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { bookingController } from "./booking.controller";

const router = Router();

router.post("/", verifyToken(["admin", "customer"]), bookingController.createBooking);

export const bookingRoute = router;
