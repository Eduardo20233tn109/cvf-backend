const Visit = require('../models/visit.model');

exports.findAll = (filter = {}) => {
  return Visit.find(filter)
    .populate('residenteId', 'nombre apellido username phone');
};

exports.findById = (id) => {
  return Visit.findById(id)
    .populate('residenteId', 'nombre apellido username phone');
};

exports.create = (data) => new Visit(data).save();

exports.update = (id, data) => {
  return Visit.findByIdAndUpdate(id, data, { new: true })
    .populate('residenteId', 'nombre apellido username phone');
};

exports.toggleEstado = async (id) => {
  const doc = await Visit.findById(id);
  doc.enabled = !doc.enabled;
  return doc.save();
};
