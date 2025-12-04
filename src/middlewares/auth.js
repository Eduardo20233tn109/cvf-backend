import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import messages from "../utils/messages.js";
import { config } from "../config.js";
const { messageGeneral } = messages;

export const verificarToken = (req, res, next) => {
  // Logging para debug (temporal)
  console.log('🔍 [AUTH] Ruta:', req.path);
  console.log('🔍 [AUTH] Headers authorization:', req.headers.authorization ? 'Presente' : 'Ausente');
  console.log('🔍 [AUTH] Todos los headers:', Object.keys(req.headers));
  
  if (!req.headers.authorization) {
    console.log('❌ [AUTH] No se proporcionó header Authorization');
    return messageGeneral(
      res,
      401,
      false,
      null,
      "Token de autenticación no proporcionado"
    );
  }
  
  const token = req.headers.authorization.split(" ")[1];
  
  if (!token) {
    console.log('❌ [AUTH] Token no encontrado en header Authorization');
    return messageGeneral(
      res,
      401,
      false,
      null,
      "Token de autenticación inválido"
    );
  }

  console.log('✅ [AUTH] Token encontrado, verificando...');
  jwt.verify(token, config.jwtSecret, async (error, payload) => {
    if (error) {
      console.log('❌ [AUTH] Error al verificar token:', error.name, error.message);
      if (error.name === 'TokenExpiredError') {
        return messageGeneral(
          res,
          401,
          false,
          null,
          "Token expirado. Por favor inicia sesión nuevamente"
        );
      }
      return messageGeneral(
        res,
        401,
        false,
        null,
        "Token inválido"
      );
    }
    
    console.log('✅ [AUTH] Token válido, payload:', { id: payload.id, _id: payload._id, tipoUsuario: payload.tipoUsuario });
    
    // Soportar tanto "id" como "_id" del payload (diferentes endpoints de login)
    const userId = payload._id || payload.id;
    
    if (!userId) {
      return messageGeneral(
        res,
        401,
        false,
        null,
        "Token inválido: no contiene ID de usuario"
      );
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return messageGeneral(
        res,
        401,
        false,
        null,
        "Usuario no encontrado"
      );
    }

    if (!user.enabled) {
      console.log('❌ [AUTH] Usuario deshabilitado');
      return messageGeneral(
        res,
        401,
        false,
        null,
        "Usuario deshabilitado. Contacta al administrador"
      );
    }
    
    console.log('✅ [AUTH] Autenticación exitosa para usuario:', user.username, 'tipo:', user.tipoUsuario);
    req.userid = userId;
    req.user = user; // Agregar usuario completo para checkRole
    next();
  });
};
