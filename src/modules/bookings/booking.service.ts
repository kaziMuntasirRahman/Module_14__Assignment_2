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

  await pool.query(
    `
    UPDATE vehicles SET availability_status='booked' WHERE id=$1
    `,
    [vehicle_id]
  );

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

const getAllBookings = async (role: string, user_id: number) => {
  let result: any;
  if (role === "admin") {
    result = await pool.query(`
    SELECT
    b.id,
    b.customer_id,
    b.vehicle_id,
    TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
    TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
    b.total_price,
    b.status,

    json_build_object(
    'name', u.name,
    'email', u.email
    ) AS customer,

    json_build_object(
    'vehicle_name', v.vehicle_name,
    'registration_number', v.registration_number
    ) AS vehicle

    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    JOIN users u ON b.customer_id = u.id;
    `);
  } else {
    result = await pool.query(
      `
    SELECT
    b.id,
    b.vehicle_id,
    TO_CHAR(b.rent_start_date, 'YYYY-MM-DD') AS rent_start_date,
    TO_CHAR(b.rent_end_date, 'YYYY-MM-DD') AS rent_end_date,
    b.total_price,
    b.status,

    json_build_object(
    'vehicle_name', v.vehicle_name,
    'type', v.type,
    'registration_number', v.registration_number
    ) AS vehicle

    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id=$1
    `,
      [user_id]
    );
  }

  return result;
};

const updateBooking = async (
  bookingId: number,
  status: "cancelled" | "returned"
) => {
  const existingBooking = await pool.query(
    `SELECT * FROM bookings WHERE id=$1`,
    [bookingId]
  );
  if (existingBooking.rowCount === 0) {
    throw new Error(`Booking bearing id ${bookingId} doesn't exist.`);
  }

  const { rent_start_date, rent_end_date } = existingBooking.rows[0];
  const startDate = new Date(rent_start_date).getTime();
  const today = Date.now();

  if (status === "cancelled" && startDate < today) {
    throw new Error("You can't cancel the booking now.");
  }

  const result = await pool.query(
    `
    UPDATE vehicles SET availability_status='available' WHERE id=$1
    `,
    [existingBooking.rows[0].vehicle_id]
  );



  const data = {
    ...result.rows[0],
    status,
    rent_start_date: rent_start_date.toISOString().slice(0, 10),
    rent_end_date: rent_end_date.toISOString().slice(0, 10),
  };

  if (status === "returned") {
    (data as any).vehicle = { availability_status: "available" };
  }

  return data;
};

export const bookingService = { createBooking, getAllBookings, updateBooking };
