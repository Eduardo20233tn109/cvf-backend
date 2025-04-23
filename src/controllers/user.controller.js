const userService = require('../services/user.service');
const UserModel = require('../models/user.model.js');
const userRepository = require('../repositories/user.repository.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// ✅ Obtener todos los usuarios
exports.getAll = async (req, res) => {
  try {
    const estado = req.query.estado || null;
    const users = await userService.getUsers(estado);
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: 'Error interno', error: err.message });
  }
};

// ✅ Crear usuario
exports.create = async (req, res) => {
  try {
    console.log("📥 Payload recibido:", req.body);
    const saved = await userService.createUser(req.body);
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error al crear usuario:", err);
    res.status(400).json({ message: err.message || 'Error al crear usuario' });
  }
};

// ✅ Actualizar usuario (Admin)
exports.update = async (req, res) => {
  try {
    const updated = await userService.updateUser(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar usuario', error: err.message });
  }
};

// ✅ Actualizar perfil (App residente y web)
exports.updateProfile = async (req, res) => {
  try {
    const { userId, nombre, telefono, correo, apellido } = req.body;
    console.log('🔧 Recibido en updateProfile:', req.body);

    const updated = await userService.updateUser(userId, {
      nombre,
      phone: telefono,
      username: correo,
      apellido
    });

    const user = await UserModel.findById(updated._id).populate('house_id');

    res.json({ message: 'Perfil actualizado', user });
  } catch (err) {
    console.error('❌ Error al actualizar perfil:', err);
    res.status(500).json({ message: 'Error al actualizar perfil', error: err.message });
  }
};


// ✅ Cambiar estado (activar/desactivar)
exports.toggleEstado = async (req, res) => {
  try {
    const updated = await userService.toggleEstado(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Error al cambiar estado', error: err.message });
  }
};

// ✅ Login para plataforma web
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario y contraseña son obligatorios"
      });
    }

    const user = await userService.login(username, password);

    const token = jwt.sign(
      { _id: user._id, tipoUsuario: user.tipoUsuario },
      process.env.JWT_SECRET || "secreta",
      { expiresIn: '1h' }
    );

    console.log("✅ Usuario autenticado (web):", username);

    return res.status(200).json({
      success: true,
      message: "Bienvenido",
      data: {
        _id: user._id,
        username: user.username,
        tipoUsuario: user.tipoUsuario,
        token
      }
    });
  } catch (err) {
    console.error("❌ Error en login web:", err);
    return res.status(401).json({
      success: false,
      message: err.message || 'Error al iniciar sesión'
    });
  }
};

// ✅ Login para app móvil (residente o guardia)
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son obligatorios'
      });
    }

    const user = await userService.findByUsername(username);

    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });

    await user.populate('house_id');

    const token = jwt.sign(
      { id: user._id, tipoUsuario: user.tipoUsuario },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '1d' }
    );

    console.log('🧠 Usuario logueado en app:', {
      _id: user._id,
      username: user.username,
      nombre: user.nombre,
      apellido: user.apellido,
      tipoUsuario: user.tipoUsuario,
      phone: user.phone,
      birthday: user.birthday,
      house_id: user.house_id
    });

    return res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        nombre: user.nombre,
        apellido: user.apellido,
        tipoUsuario: user.tipoUsuario,
        phone: user.phone,
        birthday: user.birthday,
        house_id: user.house_id
      }
    });
  } catch (err) {
    console.error('❌ Error en loginUser:', err);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// ✅ Verificar si existe un username
exports.checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    const user = await UserModel.findOne({ username });

    if (user) {
      return res.json({ available: false, _id: user._id });
    } else {
      return res.json({ available: true });
    }
  } catch (err) {
    console.error("❌ Error en checkUsername:", err);
    return res.status(500).json({ available: false, error: err.message });
  }
};

// ✅ Verificar si existe un teléfono
exports.checkPhone = async (req, res) => {
  const { phone } = req.query;
  const exists = await UserModel.exists({ phone });
  res.json({ exists: Boolean(exists) });
};

// ✅ Obtener un usuario por ID
exports.getById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate('house_id');
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    console.error("❌ Error al obtener usuario por ID:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};
