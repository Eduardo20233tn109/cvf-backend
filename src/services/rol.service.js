import * as repository from '../repositories/rol.repository.js';

export const getRoles = () => repository.findAll();
export const getRolById = (id) => repository.findById(id);
export const createRol = (data) => repository.create(data);
export const updateRol = (id, data) => repository.update(id, data);
export const deleteRol = (id) => repository.deleteRol(id);
