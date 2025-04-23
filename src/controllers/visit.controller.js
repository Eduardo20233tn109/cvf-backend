const service = require('../services/visit.service');

exports.getAll = async (req, res) => {
  try {
    const data = await service.getVisits(req.query.estado);
    res.json(data);
  } catch (e) {
    console.error('❌ Error en getAll:', e.message || e);
    res.status(500).json({ error: e.message || e });
  }
};

exports.create = async (req, res) => {
  try {
    console.log('📥 Payload recibido:', req.body);
    const visit = await service.createVisit(req.body);
    res.status(201).json(visit);
  } catch (e) {
    console.error('❌ Error en create:', e.message || e);
    res.status(400).json({ error: e.message || e });
  }
};

exports.update = async (req, res) => {
  try {
    const updated = await service.updateVisit(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    console.error('❌ Error en update:', e.message || e);
    res.status(400).json({ error: e.message || e });
  }
};

exports.toggleEstado = async (req, res) => {
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

exports.getById = async (req, res) => {
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

// ✅ CORREGIDO: Esta era la línea que tenías con export
exports.toggleEstadoConFotos = async (req, res) => {
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
