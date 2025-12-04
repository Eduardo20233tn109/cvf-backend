import { Router } from 'express';
const router = Router();
import ctrl from '../controllers/visit.controller.js';
import upload from '../middlewares/upload.js';
import { verificarToken } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/checkRole.js';

// Rutas para ADMIN, GUARDIA y RESIDENTE (ver visitas)
// ADMIN y GUARDIA ven todas, RESIDENTE solo las suyas
router.get('/', verificarToken, ctrl.getAll);
router.put('/status/:id', verificarToken, checkRole('ADMIN', 'GUARDIA'), ctrl.toggleEstado);
router.put(
  '/status-with-evidence/:id',
  verificarToken,
  checkRole('ADMIN', 'GUARDIA'),
  upload.array('evidencias', 3),
  ctrl.toggleEstadoConFotos
);

// Rutas para RESIDENTE (gestionar sus propias visitas)
router.post('/save/', verificarToken, checkRole('RESIDENTE'), ctrl.create);
router.put('/update/:id', verificarToken, checkRole('RESIDENTE'), ctrl.update);
router.put('/cancel/:id', verificarToken, checkRole('RESIDENTE'), ctrl.cancelVisit);

// Ver detalle de visita (ADMIN, GUARDIA, RESIDENTE propietario)
router.get('/:id', verificarToken, ctrl.getById);

export default router;
