import houseService from "../services/house.service.js";
import message from "../utils/messages.js";
const { messageGeneral } = message;

const houseCtrl = {};

houseCtrl.getHouses = async (req, res) => {
  try {
    const houses = await houseService.getAllHouses();

    // Añadir URL completa a la imagen
    const housesWithPhotoUrl = houses.map(house => ({
      ...house._doc,
      photoUrl: house.photo ? `http://localhost:4000/uploads/${house.photo}` : null
    }));

    messageGeneral(res, 200, true, housesWithPhotoUrl, "Lista de casas");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};


houseCtrl.getHouse = async (req, res) => {
  try {
    const house = await houseService.getHouseById(req.params.id);
    if (!house)
      return messageGeneral(res, 404, false, "", "Casa no encontrada");
    messageGeneral(res, 200, true, house, "");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};

houseCtrl.createHouse = async (req, res) => {
  try {
    const newHouse = await houseService.createHouse(req.body);
    messageGeneral(res, 201, true, newHouse, "Casa creada");
  } catch (error) {
    messageGeneral(res, 400, false, "", error.message);
  }
};

houseCtrl.updateHouse = async (req, res) => {
  try {
    const updated = await houseService.updateHouse(req.params.id, req.body);
    if (!updated)
      return messageGeneral(res, 404, false, "", "Casa no encontrada");
    messageGeneral(res, 200, true, updated, "Casa actualizada");
  } catch (error) {
    messageGeneral(res, 400, false, "", error.message);
  }
};

houseCtrl.toggleHouseStatus = async (req, res) => {
  try {
    const updated = await houseService.toggleHouseStatus(req.params.id);
    messageGeneral(res, 200, true, updated, "Estado actualizado");
  } catch (error) {
    messageGeneral(res, 400, false, "", error.message);
  }
};

houseCtrl.createHouseWithPhoto = async (req, res) => {
  try {
    const { description, street, city, zip } = req.body;
    console.log("Datos del body:", req.body);
    console.log("Archivo:", req.file);
    
    const houseData = {
      description,
      address: {
        street,
        city,
        zip,
      },
      photo: req.file ? req.file.filename : ""
    };

    const newHouse = await houseService.createHouse(houseData);
    messageGeneral(res, 201, true, newHouse, "Casa creada con imagen y datos");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};

houseCtrl.updateHouseWithPhoto = async (req, res) => {
  try {
    const { description, street, city, zip } = req.body;

    const updatedData = {
      description,
      address: {
        street,
        city,
        zip
      }
    };

    if (req.file) {
      updatedData.photo = req.file.filename;
    }

    const updatedHouse = await houseService.updateHouse(req.params.id, updatedData);

    if (!updatedHouse) {
      return messageGeneral(res, 404, false, "", "Casa no encontrada");
    }

    messageGeneral(res, 200, true, updatedHouse, "Casa actualizada con imagen");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};

houseCtrl.checkStreet = async (req, res) => {
  try {
    const { street } = req.params;
    if (!street) return messageGeneral(res, 400, false, "", "Calle no proporcionada");

    const exists = await houseService.existsByStreet(street);
    messageGeneral(res, 200, true, { exists }, "Verificación de calle");
  } catch (error) {
    messageGeneral(res, 500, false, "", error.message);
  }
};


export default houseCtrl;
