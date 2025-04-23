const repository = require('../repositories/visit.repository');

exports.getVisits = (estado) => {
  const filter = estado === 'Todos' ? {} : { estado }; // ✔️ filtramos por el campo real
  return repository.findAll(filter);
};


exports.createVisit = data => repository.create(data);
exports.updateVisit = (id, data) => repository.update(id, data);
exports.toggleEstado = id => repository.toggleEstado(id);
exports.getVisitById = (id) => repository.findById(id);
