const express = require('express');
const router = express.Router();
const controller = require('../controllers/user.controller.js');
const auth = require('../middlewares/auth.js');
const { verificarToken } = auth;

// Rutas públicas
router.post('/login', controller.login); // Web
router.post('/login-mobile', controller.loginUser); // Móvil

// Rutas de verificación
router.get("/check-username", controller.checkUsername);
router.get("/check-phone", controller.checkPhone);

// CRUD básico
router.get('/', controller.getAll);
router.post('/save', controller.create);
router.put('/update/:id', controller.update);
router.put('/status/:id', controller.toggleEstado);

// Actualización de perfil para residentes
router.put('/update-profile', controller.updateProfile);

// Obtener perfil individual
router.get("/:id", controller.getById);

module.exports = router;
