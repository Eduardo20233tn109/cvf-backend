const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  fecha: { type: Date, required: true },
  hora: { type: String, required: true },
  numeroPersonas: { type: Number, required: true },
  descripcion: { type: String, required: true },
  tipoVisita: {
    type: String,
    enum: ['Familiar', 'Técnica'],
    required: true
  },
  placasVehiculo: { type: String },
  contrasena: { type: String },
  numeroCasa: { type: String, required: true },
  nombreVisitante: { type: String, required: true },
  estado: {
    type: String,
    enum: ['Pendiente', 'Aprobada', 'Cancelada','Finalizada'],
    default: 'Pendiente'
  },
  residenteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  observaciones: { type: String }, // ✅ nuevo campo
  evidencias: [String]             // ✅ nuevo campo (array de strings)
}, {
  timestamps: true
});

module.exports = mongoose.model('Visita', visitaSchema);
