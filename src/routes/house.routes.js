import { Router } from "express";
import houseCtrl from "../controllers/house.controller.js";
import upload from "../middlewares/upload.js";
import { verificarToken } from "../middlewares/auth.js";
import { checkRole } from "../middlewares/checkRole.js";

const route = Router();

// Ruta pública (útil para registro de usuarios)
route.get("/check-street/:street", houseCtrl.checkStreet);

// Rutas protegidas - Solo ADMIN
route.get("/", verificarToken, checkRole('ADMIN'), houseCtrl.getHouses);
route.get("/:id", verificarToken, checkRole('ADMIN'), houseCtrl.getHouse);
route.post("/", verificarToken, checkRole('ADMIN'), houseCtrl.createHouse);
route.put("/:id", verificarToken, checkRole('ADMIN'), houseCtrl.updateHouse);
route.put("/status/:id", verificarToken, checkRole('ADMIN'), houseCtrl.toggleHouseStatus);

// Rutas con imagen - Solo ADMIN
route.post("/with-photo", verificarToken, checkRole('ADMIN'), upload.single("photo"), houseCtrl.createHouseWithPhoto);
route.put("/with-photo/:id", verificarToken, checkRole('ADMIN'), upload.single("photo"), houseCtrl.updateHouseWithPhoto);

export default route;
