import * as service from '../services/visit.service.js';

export const getAll = async (req, res) => {
  try {
    const { estado } = req.query;
    const userRole = req.user?.tipoUsuario;
    const userId = req.userid;

    // Si es RESIDENTE, solo puede ver sus propias visitas
    if (userRole === 'RESIDENTE') {
      const data = await service.getVisitsByResidente(userId, estado);
      return res.json(data);
    }

    // ADMIN y GUARDIA ven todas las visitas
    const data = await service.getVisits(estado);
    res.json(data);
  } catch (e) {
    console.error('❌ Error en getAll:', e.message || e);
    res.status(500).json({ error: e.message || e });
  }
};

export const create = async (req, res) => {
  try {
    console.log('📥 Payload recibido:', req.body);
    const visit = await service.createVisit(req.body);
    res.status(201).json(visit);
  } catch (e) {
    console.error('❌ Error en create:', e.message || e);
    res.status(400).json({ error: e.message || e });
  }
};

export const update = async (req, res) => {
  try {
    const updated = await service.updateVisit(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    console.error('❌ Error en update:', e.message || e);
    res.status(400).json({ error: e.message || e });
  }
};

export const toggleEstado = async (req, res) => {
  try {
    const { observaciones, evidencias } = req.body;
    const visita = await service.getVisitById(req.params.id);

    if (!visita) {
      return res.status(404).json({ success: false, message: "Visita no encontrada" });
    }

    if (visita.estado === 'Pendiente') {
      visita.estado = 'Aprobada';
    } else if (visita.estado === 'Aprobada') {
      visita.estado = 'Finalizada';
    } else {
      return res.status(400).json({
        success: false,
        message: `No se puede modificar una visita con estado "${visita.estado}".`,
      });
    }

    if (observaciones) {
      visita.observaciones = observaciones;
    }

    if (Array.isArray(evidencias) && evidencias.length > 0) {
      visita.evidencias = evidencias;
    }

    const updated = await visita.save();
    return res.json({ success: true, updated });
  } catch (e) {
    console.error('❌ Error en toggleEstado:', e.message || e);
    return res.status(400).json({ success: false, message: e.message || e });
  }
};

export const getById = async (req, res) => {
  try {
    const visita = await service.getVisitById(req.params.id);
    if (!visita) {
      return res.status(404).json({ success: false, message: 'Visita no encontrada' });
    }
    res.json({ success: true, data: visita });
  } catch (e) {
    console.error('❌ Error en getById:', e.message || e);
    res.status(500).json({ success: false, message: e.message || e });
  }
};

/**
 * Cancela una visita
 * Solo RESIDENTE puede cancelar sus propias visitas
 */
export const cancelVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const residenteId = req.userid; // Usar el ID del usuario autenticado (del token)
    
    // Obtener la visita
    const visita = await service.getVisitById(id);
    
    if (!visita) {
      return res.status(404).json({ 
        success: false, 
        message: 'Visita no encontrada' 
      });
    }
    
    // Verificar que la visita pertenezca al residente autenticado
    // Manejar tanto si residenteId está poblado (objeto) como si es solo el ID
    const visitaResidenteId = visita.residenteId._id 
      ? visita.residenteId._id.toString() 
      : visita.residenteId.toString();
    
    if (visitaResidenteId !== residenteId.toString()) {
      console.log('🔍 Comparación de IDs:', {
        visitaResidenteId,
        residenteIdAutenticado: residenteId.toString(),
        sonIguales: visitaResidenteId === residenteId.toString()
      });
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permiso para cancelar esta visita' 
      });
    }
    
    // Cancelar la visita
    const visitaCancelada = await service.cancelVisit(id, residenteId);
    
    res.json({ 
      success: true, 
      data: visitaCancelada,
      message: 'Visita cancelada exitosamente'
    });
  } catch (e) {
    console.error('❌ Error al cancelar visita:', e.message || e);
    res.status(400).json({ 
      success: false, 
      message: e.message || e 
    });
  }
};

// ✅ CORREGIDO: Esta era la línea que tenías con export
export const toggleEstadoConFotos = async (req, res) => {
  try {
    const visita = await service.getVisitById(req.params.id);
    if (!visita) return res.status(404).json({ success: false, message: 'Visita no encontrada' });

    if (visita.estado === 'Pendiente') {
      visita.estado = 'Aprobada';
    } else if (visita.estado === 'Aprobada') {
      visita.estado = 'Finalizada';
    }

    if (req.body.observaciones) {
      visita.observaciones = req.body.observaciones;
    }

    if (req.files && req.files.length > 0) {
      const evidencias = req.files.map(file => file.filename);
      visita.evidencias = evidencias;
    }

    const updated = await visita.save();
    res.json({ success: true, updated });
  } catch (e) {
    console.error('❌ Error al actualizar con fotos:', e.message);
    res.status(400).json({ success: false, message: e.message });
  }
};

export default {
  getAll,
  create,
  update,
  toggleEstado,
  getById,
  cancelVisit,
  toggleEstadoConFotos
};
