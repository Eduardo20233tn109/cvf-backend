import { Router } from "express";
import houseCtrl from "../controllers/house.controller.js";
import upload from "../middlewares/upload.js";

const route = Router();

route.get("/check-street/:street", houseCtrl.checkStreet); // debe ir primero
route.get("/", houseCtrl.getHouses);
route.get("/:id", houseCtrl.getHouse);
route.post("/", houseCtrl.createHouse); // sin imagen
route.put("/:id", houseCtrl.updateHouse);
route.put("/status/:id", houseCtrl.toggleHouseStatus);

// Ruta con imagen y datos usando multer
route.post("/with-photo", upload.single("photo"), houseCtrl.createHouseWithPhoto);
route.put("/with-photo/:id", upload.single("photo"), houseCtrl.updateHouseWithPhoto);




export default route;
