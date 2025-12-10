import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const addVehicle = async (req: Request, res: Response) => {
  try {
    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;
    const result = await vehicleServices.addVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );
    if (!result) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to add vehicles" });
    }

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getAllVehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleServices.getAllVehicles();
    if (result.rowCount === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No Vehicles found", data: [] });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);

    const result = await vehicleServices.getVehicleById(vehicleId);
    if (result.rowCount === 0) {
      return res.status(200).json({
        success: true,
        message: `Vehicle bearing id ${vehicleId} doesn't exist.`,
      });
    }
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);

    const {
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    } = req.body;

    const isVehicleExist = await vehicleServices.getVehicleById(vehicleId);
    if (!isVehicleExist) {
      return res.status(400).json({
        success: false,
        message: `Vehicle, bearing id ${vehicleId} doesn't exist.`,
      });
    }

    const existedVehicle = isVehicleExist.rows[0];

    const updatedVehicleName = vehicle_name ?? existedVehicle.name;
    const updatedVehicleType = type ?? existedVehicle.type;
    const updatedVehicleRegistrationNumber =
      registration_number ?? existedVehicle.registration_number;
    const updatedVehicleDailyRentPrice =
      daily_rent_price ?? existedVehicle.daily_rent_price;
    const updatedAvailabilityStatus =
      availability_status ?? existedVehicle.availability_status;

    const result = await vehicleServices.updateVehicle(
      vehicleId,
      updatedVehicleName,
      updatedVehicleType,
      updatedVehicleRegistrationNumber,
      updatedVehicleDailyRentPrice,
      updatedAvailabilityStatus
    );
    if (result.rowCount === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update." });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const vehicleId = Number(req.params.vehicleId);
    console.log(`vehicleId: ${vehicleId}`);
    console.log(`type of vehicleId: ${typeof vehicleId}`);
    
    const isVehicleExist = await vehicleServices.getVehicleById(vehicleId);

    if (!isVehicleExist) {
      return res.status(400).json({
        success: false,
        message: `Vehicle, bearing id ${vehicleId} doesn't exist.`,
      });
    }

    const existedVehicle = isVehicleExist.rows[0];

    if (existedVehicle.availability_status === "booked") {
      return res.status(400).json({
        success: false,
        message: `Can not delete vehicle, bearing id {vehicleId} because it is booked. `,
      });
    }
    console.log("point E");

    const result = await vehicleServices.deleteVehicle(vehicleId);
    console.log("point F");

    if (result.rowCount === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to delete" });
    }
    console.log("point G");

    return res
      .status(200)
      .json({ success: true, message: "Vehicle deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const vehicleController = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
