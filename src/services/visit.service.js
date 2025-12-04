import * as repository from '../repositories/visit.repository.js';

export const getVisits = (estado) => {
  // Si no se envía estado, o es 'Todos', o está vacío, devolver todas las visitas
  if (!estado || estado === 'Todos' || estado === '' || estado === 'undefined') {
    return repository.findAll({});
  }
  // Si se envía un estado específico, filtrar por ese estado
  return repository.findAll({ estado });
};

export const createVisit = data => repository.create(data);
export const updateVisit = (id, data) => repository.update(id, data);
export const toggleEstado = id => repository.toggleEstado(id);
export const getVisitById = (id) => repository.findById(id);

/**
 * Cancela una visita
 * Solo se pueden cancelar visitas en estado "Pendiente" o "Aprobada"
 * Por ahora sin verificación estricta de dueño
 */
export const cancelVisit = async (visitId, residenteId) => {
  try {
    const visita = await repository.findById(visitId);
    
    if (!visita) {
      throw new Error('Visita no encontrada');
    }
    
    // Verificar que la visita pertenezca al residente (solo si se proporciona residenteId)
    if (residenteId && visita.residenteId.toString() !== residenteId.toString()) {
      throw new Error('No tienes permiso para cancelar esta visita');
    }
    
    // Solo se puede cancelar si está Pendiente o Aprobada
    if (visita.estado === 'Finalizada') {
      throw new Error('No se puede cancelar una visita que ya está finalizada');
    }
    
    if (visita.estado === 'Cancelada') {
      throw new Error('La visita ya está cancelada');
    }
    
    // Cambiar estado a Cancelada
    visita.estado = 'Cancelada';
    await visita.save();
    
    return visita;
  } catch (error) {
    throw error;
  }
};
