import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import messages from "../utils/messages.js";
import { config } from "../config.js";
const { messageGeneral } = messages;

export const verificarToken = (req, res, next) => {
  if (!req.headers.authorization) {
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
    return messageGeneral(
      res,
      401,
      false,
      null,
      "Token de autenticación inválido"
    );
  }

  jwt.verify(token, config.jwtSecret, async (error, payload) => {
    if (error) {
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
      return messageGeneral(
        res,
        401,
        false,
        null,
        "Usuario deshabilitado. Contacta al administrador"
      );
    }
    
    req.userid = userId;
    req.user = user; // Agregar usuario completo para checkRole
    next();
  });
};
