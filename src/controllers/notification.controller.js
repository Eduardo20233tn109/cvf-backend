const service = require('../services/notification.service');

/**
 * Obtiene todas las notificaciones de un usuario
 * GET /api/notifications?userId={userId}
 */
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: ['userId es requerido']
      });
    }

    const notifications = await service.getNotificationsByUserId(userId);
    
    // Retornar array directo (formato que espera el frontend)
    res.status(200).json(notifications);
  } catch (error) {
    console.error('❌ Error en getNotifications:', error.message);
    
    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(500).json({
      message: 'Error al obtener notificaciones',
      error: error.message
    });
  }
};

/**
 * Crea una nueva notificación
 * POST /api/notifications
 */
exports.createNotification = async (req, res) => {
  try {
    const { usuarioId, visitaId, titulo, mensaje, tipo } = req.body;

    // Validaciones básicas
    const errors = [];
    if (!usuarioId) errors.push('usuarioId es requerido');
    if (!visitaId) errors.push('visitaId es requerido');
    if (!titulo) errors.push('titulo es requerido');
    if (!mensaje) errors.push('mensaje es requerido');

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors
      });
    }

    const notification = await service.createNotification({
      usuarioId,
      visitaId,
      titulo,
      mensaje,
      tipo
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error('❌ Error en createNotification:', error.message);

    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (error.message === 'Visita no encontrada') {
      return res.status(404).json({ message: 'Visita no encontrada' });
    }

    if (error.message.includes('es requerido') || 
        error.message.includes('Solo los residentes') ||
        error.message.includes('no pertenece')) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: [error.message]
      });
    }

    res.status(500).json({
      message: 'Error al crear notificación',
      error: error.message
    });
  }
};

/**
 * Marca una notificación como leída
 * PUT /api/notifications/{id}/read
 * Opcionalmente puede recibir userId en query para validación de seguridad
 */
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query; // Opcional: para validación de seguridad

    // Si se proporciona userId, validar que la notificación pertenece al usuario
    // Si no se proporciona, solo marcar como leída (menos seguro pero más flexible)
    const notification = await service.markAsRead(id, userId);
    res.status(200).json(notification);
  } catch (error) {
    console.error('❌ Error en markAsRead:', error.message);

    if (error.message === 'Notificación no encontrada') {
      return res.status(404).json({ message: 'Notificación no encontrada' });
    }

    if (error.message.includes('No tienes permiso')) {
      return res.status(403).json({
        message: 'No tienes permiso para realizar esta acción',
        error: error.message
      });
    }

    res.status(500).json({
      message: 'Error al marcar notificación como leída',
      error: error.message
    });
  }
};

/**
 * Marca todas las notificaciones de un usuario como leídas
 * PUT /api/notifications/read-all?userId={userId}
 */
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: ['userId es requerido']
      });
    }

    const result = await service.markAllAsRead(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('❌ Error en markAllAsRead:', error.message);

    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(500).json({
      message: 'Error al marcar notificaciones como leídas',
      error: error.message
    });
  }
};

/**
 * Obtiene el conteo de notificaciones no leídas
 * GET /api/notifications/unread-count?userId={userId}
 */
exports.getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: 'Datos inválidos',
        errors: ['userId es requerido']
      });
    }

    const count = await service.getUnreadCount(userId);
    res.status(200).json({ count });
  } catch (error) {
    console.error('❌ Error en getUnreadCount:', error.message);

    if (error.message === 'Usuario no encontrado') {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(500).json({
      message: 'Error al obtener conteo de notificaciones',
      error: error.message
    });
  }
};

