import { Router } from "express";
import { verifyToken } from "../../middlewares/verifyToken";
import { bookingController } from "./booking.controller";

const router = Router();

router.post(
  "/",
  verifyToken(["admin", "customer"]),
  bookingController.createBooking
);
router.get(
  "/",
  verifyToken(["admin", "customer"]),
  bookingController.getAllBookings
);

router.put(
  "/:bookingId",
  verifyToken(["admin", "customer"]),
  bookingController.updateBooking
);

export const bookingRoute = router;
