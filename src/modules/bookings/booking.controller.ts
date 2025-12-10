import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } =
      req.body;

    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({ success: false, message: "Input missing" });
    }

    const result = await bookingService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date
    );

    res
      .status(201)
      .json({
        success: true,
        message: "Booking created successfully",
        data: result,
      });
    return;
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const bookingController = { createBooking };
