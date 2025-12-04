import { Router } from 'express';
const router = Router();
import ctrl from '../controllers/rol.controller.js';
import { verificarToken } from '../middlewares/auth.js';
import { checkRole } from '../middlewares/checkRole.js';

// Todas las rutas protegidas - Solo ADMIN
router.get('/', verificarToken, checkRole('ADMIN'), ctrl.getAll);
router.post('/', verificarToken, checkRole('ADMIN'), ctrl.create);
router.put('/:id', verificarToken, checkRole('ADMIN'), ctrl.update);
router.delete('/:id', verificarToken, checkRole('ADMIN'), ctrl.remove);

export default router;
