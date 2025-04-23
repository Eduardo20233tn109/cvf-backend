const User = require('../models/user.model.js');

exports.findAll = (filter = {}) => User.find(filter).populate('house_id');
exports.findById = id => User.findById(id);
exports.create = data => new User(data).save();
exports.update = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
exports.toggleEstado = async id => {
  const user = await User.findById(id);
  user.enabled = !user.enabled;
  return user.save();
};

exports.getUserByUsername = async (username) => {
  return await User.findOne({ username });
};

