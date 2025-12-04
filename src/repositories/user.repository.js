import User from '../models/user.model.js';

export const findAll = (filter = {}) => User.find(filter).populate('house_id');
export const findById = id => User.findById(id);
export const create = data => new User(data).save();
export const update = (id, data) => User.findByIdAndUpdate(id, data, { new: true });
export const toggleEstado = async id => {
  const user = await User.findById(id);
  user.enabled = !user.enabled;
  return user.save();
};

export const getUserByUsername = async (username) => {
  return await User.findOne({ username });
};

