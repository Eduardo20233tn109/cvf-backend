const router = require('express').Router();
const ctrl = require('../controllers/visit.controller');
const upload = require('../middlewares/upload');

// Ruta nueva para validación de visita con fotos
router.put(
  '/status-with-evidence/:id',
  upload.array('evidencias', 3),
  ctrl.toggleEstadoConFotos
);

// Rutas existentes
router.get('/', ctrl.getAll);
router.post('/save/', ctrl.create);
router.put('/update/:id', ctrl.update);
router.put('/status/:id', ctrl.toggleEstado);
router.put('/cancel/:id', ctrl.cancelVisit); // ✅ Ruta sin autenticación (por ahora)
router.get('/:id', ctrl.getById);

module.exports = router;
