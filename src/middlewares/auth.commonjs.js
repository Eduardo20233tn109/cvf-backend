const User = require('../models/user.model.js');
const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar token JWT (versión CommonJS)
 */
const verificarToken = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this resource 1"
      });
    }
    
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this resource 2"
      });
    }

    jwt.verify(token, process.env.JWT_SECRET || "secreta", async (error, payload) => {
      if (error) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to access this resource 3"
        });
      }
      
      const { _id } = payload;
      const resp = await User.findById(_id);
      
      if (!resp) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized to access this resource 4"
        });
      }
      
      req.userid = _id;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error al verificar token"
    });
  }
};

module.exports = { verificarToken };


