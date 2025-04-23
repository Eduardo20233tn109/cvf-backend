import houseRepo from "../repositories/house.repository.js";

const getAllHouses = async () => await houseRepo.findAll();

const getHouseById = async (id) => await houseRepo.findById(id);

const createHouse = async (data) => await houseRepo.create(data);

const updateHouse = async (id, data) => await houseRepo.update(id, data);

const toggleHouseStatus = async (id) => {
  const house = await houseRepo.findById(id);
  if (!house) throw new Error("❌ Casa no encontrada.");
  const newStatus = house.status === "activo" ? "inactivo" : "activo";
  return await houseRepo.changeStatus(id, newStatus);
};

const existsByStreet = async (street) => {
  if (!street || street.trim().length < 3 || street.trim().length > 50) {
    throw new Error("El nombre de la calle debe tener entre 3 y 50 caracteres.");
  }

  const allHouses = await houseRepo.findAll();
  return allHouses.some(
    (h) =>
      h.address?.street?.trim().toLowerCase() === street.trim().toLowerCase()
  );
};


export default {
  getAllHouses,
  getHouseById,
  createHouse,
  updateHouse,
  toggleHouseStatus,
  existsByStreet // 👈 nuevo export
};
