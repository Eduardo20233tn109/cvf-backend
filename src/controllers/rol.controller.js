const service = require('../services/rol.service');

exports.getAll = async (req, res) => {
  try {
    const data = await service.getRoles();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.create = async (req, res) => {
  try {
    const rol = await service.createRol(req.body);
    res.status(201).json(rol);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await service.updateRol(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: e });
  }
};

exports.remove = async (req, res) => {
  try {
    await service.deleteRol(req.params.id);
    res.json({ message: 'Rol eliminado' });
  } catch (e) {
    res.status(400).json({ error: e });
  }
};
