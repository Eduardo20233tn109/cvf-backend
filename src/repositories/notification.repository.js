import Notification from '../models/notification.model.js';

export const findAll = (filter = {}) => {
  return Notification.find(filter)
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado')
    .sort({ createdAt: -1 }); // Ordenar por fecha descendente (más recientes primero)
};

export const findByUserId = (userId) => {
  return Notification.find({ usuarioId: userId })
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado')
    .sort({ createdAt: -1 });
};

export const findById = (id) => {
  return Notification.findById(id)
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado');
};

export const create = (data) => {
  return new Notification(data).save();
};

export const update = (id, data) => {
  return Notification.findByIdAndUpdate(id, data, { new: true })
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado');
};

export const markAsRead = (id) => {
  return Notification.findByIdAndUpdate(
    id,
    { leida: true },
    { new: true }
  )
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado');
};

export const markAllAsRead = (userId) => {
  return Notification.updateMany(
    { usuarioId: userId, leida: false },
    { leida: true }
  );
};

export const countUnread = (userId) => {
  return Notification.countDocuments({ usuarioId: userId, leida: false });
};

