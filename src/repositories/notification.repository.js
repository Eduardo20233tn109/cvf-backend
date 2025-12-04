const Notification = require('../models/notification.model');

exports.findAll = (filter = {}) => {
  return Notification.find(filter)
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado')
    .sort({ createdAt: -1 }); // Ordenar por fecha descendente (más recientes primero)
};

exports.findByUserId = (userId) => {
  return Notification.find({ usuarioId: userId })
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado')
    .sort({ createdAt: -1 });
};

exports.findById = (id) => {
  return Notification.findById(id)
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado');
};

exports.create = (data) => {
  return new Notification(data).save();
};

exports.update = (id, data) => {
  return Notification.findByIdAndUpdate(id, data, { new: true })
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado');
};

exports.markAsRead = (id) => {
  return Notification.findByIdAndUpdate(
    id,
    { leida: true },
    { new: true }
  )
    .populate('usuarioId', 'nombre apellido username phone tipoUsuario')
    .populate('visitaId', 'fecha hora nombreVisitante estado');
};

exports.markAllAsRead = (userId) => {
  return Notification.updateMany(
    { usuarioId: userId, leida: false },
    { leida: true }
  );
};

exports.countUnread = (userId) => {
  return Notification.countDocuments({ usuarioId: userId, leida: false });
};

