import pool from "../../config/db";
import { vehicleServices } from "../vehicles/vehicle.service";

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string
) => {
  const vehicleData = await vehicleServices.getVehicleById(vehicle_id);

  if (vehicleData.rowCount === 0) {
    throw new Error(`Vehicle bearing id ${vehicle_id} doesn't exist.`);
  }

  const vehicle = vehicleData.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error(`The vehicle is already booked.`);
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  const result = await pool.query(
    `
      INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *
   `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      days * vehicle.daily_rent_price,
      "active",
    ]
  );

  if (result.rowCount === 0) throw new Error(`Failed to book`);

  return {
    ...result.rows[0],
    rent_start_date: result.rows[0].rent_start_date.toISOString().slice(0, 10),
    rent_end_date: result.rows[0].rent_end_date.toISOString().slice(0, 10),
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

export const bookingService = { createBooking };
