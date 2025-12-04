const repository = require('../repositories/notification.repository');
const User = require('../models/user.model');
const Visit = require('../models/visit.model');

/**
 * Obtiene todas las notificaciones de un usuario
 */
exports.getNotificationsByUserId = async (userId) => {
  // Validar que el usuario existe
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Validar que el usuario es un RESIDENTE
  if (user.tipoUsuario !== 'RESIDENTE') {
    throw new Error('Solo los residentes pueden recibir notificaciones');
  }

  return repository.findByUserId(userId);
};

/**
 * Crea una nueva notificación
 */
exports.createNotification = async (data) => {
  const { usuarioId, visitaId, titulo, mensaje, tipo = 'validacion_visita' } = data;

  // Validaciones
  if (!usuarioId) {
    throw new Error('usuarioId es requerido');
  }
  if (!visitaId) {
    throw new Error('visitaId es requerido');
  }
  if (!titulo || titulo.trim() === '') {
    throw new Error('titulo es requerido');
  }
  if (!mensaje || mensaje.trim() === '') {
    throw new Error('mensaje es requerido');
  }

  // Validar que el usuario existe
  const user = await User.findById(usuarioId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  // Validar que el usuario es un RESIDENTE
  if (user.tipoUsuario !== 'RESIDENTE') {
    throw new Error('Solo los residentes pueden recibir notificaciones');
  }

  // Validar que la visita existe
  const visit = await Visit.findById(visitaId);
  if (!visit) {
    throw new Error('Visita no encontrada');
  }

  // Validar que la visita pertenece al usuario
  if (visit.residenteId.toString() !== usuarioId.toString()) {
    throw new Error('La visita no pertenece a este usuario');
  }

  // Sanitizar mensaje (limitar tamaño)
  const sanitizedMensaje = mensaje.trim().substring(0, 2000);
  const sanitizedTitulo = titulo.trim().substring(0, 200);

  // Crear la notificación
  const notification = await repository.create({
    usuarioId,
    visitaId,
    titulo: sanitizedTitulo,
    mensaje: sanitizedMensaje,
    tipo,
    leida: false
  });

  return notification;
};

/**
 * Marca una notificación como leída
 * @param {string} notificationId - ID de la notificación
 * @param {string} userId - ID del usuario (opcional, para validación de seguridad)
 */
exports.markAsRead = async (notificationId, userId = null) => {
  const notification = await repository.findById(notificationId);
  
  if (!notification) {
    throw new Error('Notificación no encontrada');
  }

  // Si se proporciona userId, validar que la notificación pertenece al usuario (seguridad)
  if (userId && notification.usuarioId._id.toString() !== userId.toString()) {
    throw new Error('No tienes permiso para marcar esta notificación como leída');
  }

  return repository.markAsRead(notificationId);
};

/**
 * Marca todas las notificaciones de un usuario como leídas
 */
exports.markAllAsRead = async (userId) => {
  // Validar que el usuario existe
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const result = await repository.markAllAsRead(userId);
  return {
    message: 'Todas las notificaciones han sido marcadas como leídas',
    updatedCount: result.modifiedCount
  };
};

/**
 * Obtiene el conteo de notificaciones no leídas de un usuario
 */
exports.getUnreadCount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  return repository.countUnread(userId);
};

