const Rol = require('../models/rol.model');

exports.findAll = () => Rol.find();
exports.findById = id => Rol.findById(id);
exports.create = data => new Rol(data).save();
exports.update = (id, data) => Rol.findByIdAndUpdate(id, data, { new: true });
exports.delete = id => Rol.findByIdAndDelete(id);
