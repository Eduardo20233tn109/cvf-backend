const Visit = require('../models/visit.model');

exports.findAll = (filter = {}) => Visit.find(filter);
exports.findById = id => Visit.findById(id);
exports.create = data => new Visit(data).save();
exports.update = (id, data) => Visit.findByIdAndUpdate(id, data, { new: true });
exports.toggleEstado = async id => {
  const doc = await Visit.findById(id);
  doc.enabled = !doc.enabled;
  return doc.save();
};
