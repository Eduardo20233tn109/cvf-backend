import Rol from '../models/rol.model.js';

export const findAll = () => Rol.find();
export const findById = id => Rol.findById(id);
export const create = data => new Rol(data).save();
export const update = (id, data) => Rol.findByIdAndUpdate(id, data, { new: true });
export const deleteRol = id => Rol.findByIdAndDelete(id);
