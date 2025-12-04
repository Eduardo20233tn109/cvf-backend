import express from 'express';
const router = express.Router();
import controller from '../controllers/user.controller.js';
import { verificarToken } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/checkRole.js';

// Rutas públicas (sin autenticación)
router.post('/login', controller.login); // Web
router.post('/login-mobile', controller.loginUser); // Móvil
router.get("/check-username", controller.checkUsername);
router.get("/check-phone", controller.checkPhone);

// Rutas protegidas - Solo ADMIN
router.get('/', verificarToken, checkRole('ADMIN'), controller.getAll);
router.post('/save', verificarToken, checkRole('ADMIN'), controller.create);
router.put('/update/:id', verificarToken, checkRole('ADMIN'), controller.update);
router.put('/status/:id', verificarToken, checkRole('ADMIN'), controller.toggleEstado);

// Rutas protegidas - Usuario autenticado (cualquier rol)
router.put('/update-profile', verificarToken, controller.updateProfile);
router.get("/:id", verificarToken, controller.getById);

export default router;
