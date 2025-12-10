import express, { Request, Response } from "express";
import { initDB } from "./config/db";
import logger from "./middlewares/logger";
import { authRoutes } from "./modules/auth/auth.route";
import { usersRoutes } from "./modules/users/user.route";
import { vehicleRoutes } from "./modules/vehicles/vehicle.route";
import { bookingRoute } from "./modules/bookings/booking.route";
const app = express();

// middlewares
app.use(express.json());

initDB();

// routes
// app.use("/api/v1", logger);

// auth apis
app.use("/api/v1/auth", logger, authRoutes);

// users apis
app.use("/api/v1/users", logger, usersRoutes);

// vehicles routes
app.use("/api/v1/vehicles", logger, vehicleRoutes);

// bookings routes
app.use("/api/v1/bookings", logger, bookingRoute)

// base route
app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello from Easy_Rent Server...!!!");
});

export default app;
