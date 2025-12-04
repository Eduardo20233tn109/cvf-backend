export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'No autenticado. Por favor inicia sesión.' 
      });
    }

    if (!allowedRoles.includes(req.user.tipoUsuario)) {
      return res.status(403).json({ 
        success: false,
        message: 'No tienes permisos para acceder a este recurso.',
        requiredRoles: allowedRoles,
        yourRole: req.user.tipoUsuario
      });
    }

    next();
  };
};
