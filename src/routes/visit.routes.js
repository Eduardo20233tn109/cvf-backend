const router = require('express').Router();
const ctrl = require('../controllers/visit.controller');
const upload = require('../middlewares/upload'); // Asegúrate de que exportas multer configurado

// Ruta nueva para validación de visita con fotos
router.put(
  '/status-with-evidence/:id',
  upload.array('evidencias', 3), // Puedes cambiar el límite según cuántas imágenes esperas
  ctrl.toggleEstadoConFotos
);

// Rutas existentes
router.get('/', ctrl.getAll);
router.post('/save/', ctrl.create);
router.put('/update/:id', ctrl.update);
router.put('/status/:id', ctrl.toggleEstado);
router.get('/:id', ctrl.getById);

module.exports = router;
