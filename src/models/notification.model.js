import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visitaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visita',
    required: true
  },
  titulo: {
    type: String,
    required: true,
    maxlength: 200
  },
  mensaje: {
    type: String,
    required: true,
    maxlength: 2000
  },
  tipo: {
    type: String,
    enum: ['validacion_visita'],
    default: 'validacion_visita',
    required: true
  },
  leida: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
notificationSchema.index({ usuarioId: 1, leida: 1, createdAt: -1 });
notificationSchema.index({ usuarioId: 1 });
notificationSchema.index({ leida: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);

