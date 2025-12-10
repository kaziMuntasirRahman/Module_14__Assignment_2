import pool from "../../config/db";

const addVehicle = async (
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) => {
  const result = await pool.query(
    `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  if (result.rowCount === 0) return null;
  return result.rows[0];
};

const getAllVehicles = async () => await pool.query(`SELECT * FROM vehicles`);

const getVehicleById = async (vehicleId: number) =>
  await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [vehicleId]);

const updateVehicle = async (
  id: number,
  vehicle_name: string,
  type: string,
  registration_number: string,
  daily_rent_price: number,
  availability_status: string
) =>
  await pool.query(
    `
    UPDATE vehicles
    SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5
    WHERE id=$6
    RETURNING id, vehicle_name, type, registration_number, daily_rent_price, availability_status
   `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );

const deleteVehicle = async (vehicleId: number) =>
  await pool.query(`DELETE FROM vehicles WHERE id=$1 RETURNING *`, [vehicleId]);

export const vehicleServices = {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
