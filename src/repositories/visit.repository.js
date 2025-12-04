import Visit from '../models/visit.model.js';

export const findAll = (filter = {}) => {
  return Visit.find(filter)
    .populate('residenteId', 'nombre apellido username phone');
};

export const findById = (id) => {
  return Visit.findById(id)
    .populate('residenteId', 'nombre apellido username phone');
};

export const create = (data) => new Visit(data).save();

export const update = (id, data) => {
  return Visit.findByIdAndUpdate(id, data, { new: true })
    .populate('residenteId', 'nombre apellido username phone');
};

export const toggleEstado = async (id) => {
  const doc = await Visit.findById(id);
  doc.enabled = !doc.enabled;
  return doc.save();
};
