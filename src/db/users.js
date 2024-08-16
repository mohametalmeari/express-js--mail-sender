const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

const UserModel = mongoose.model("User", UserSchema);

const createUser = (values) =>
  new UserModel(values).save().then((user) => user.toObject());
const getUsers = () => UserModel.find();
const getUserByEmail = (email) => UserModel.findOne({ email });
const getUserBySessionToken = (sessionToken) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
const getUserById = (id) => UserModel.findById(id);
const updateUserById = (id, values) => UserModel.findByIdAndUpdate(id, values);
const deleteUserById = (id) => UserModel.findByIdAndDelete(id);

module.exports = {
  UserModel,
  createUser,
  getUsers,
  getUserByEmail,
  getUserBySessionToken,
  getUserById,
  updateUserById,
  deleteUserById,
};
