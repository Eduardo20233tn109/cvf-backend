import { Router } from 'express';
const router = Router();
import controller from '../controllers/notification.controller.js';

// Obtener notificaciones de un usuario
router.get('/', controller.getNotifications);

// Obtener conteo de notificaciones no leídas (debe ir antes de /:id para evitar conflictos)
router.get('/unread-count', controller.getUnreadCount);

// Marcar todas las notificaciones como leídas (debe ir antes de /:id para evitar conflictos)
router.put('/read-all', controller.markAllAsRead);

// Crear notificación
router.post('/', controller.createNotification);

// Marcar notificación como leída (debe ir al final porque usa /:id)
router.put('/:id/read', controller.markAsRead);

export default router;

