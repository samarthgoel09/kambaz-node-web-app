import UserModel from "./model.js";
import bcrypt    from "bcrypt";
import model from "./model.js"; 
import { v4 as uuidv4 } from "uuid";  

export const createUser = (user) => {
  const { _id, ...u } = user;
  const newUser       = { ...u, _id: uuidv4() };
  return model.create(newUser);
};

export const findUserById = async (userId) => {
  return UserModel.findById(userId).exec();
};


export const findUserByUsername = async (username) => {
  return UserModel.findOne({ username }).exec();
};

export const findUserByCredentials = async (username, password) => {
  const user = await UserModel.findOne({
    $or: [
      { username },
      { loginId: username }
    ]
  }).exec();

  if (!user) return null;

  if (user.password === password) return user;

  try {
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
  } catch (e) {
    console.warn("bcrypt.compare failed:", e.message);
  }

  return null;
};

export const updateUser = async (userId, updates) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).exec();
};


export const deleteUser = async (userId) => {
  return UserModel.findByIdAndDelete(userId).exec();
};
export const findUsersByRole = (role) =>
  UserModel.find({ role }).exec();

export const findUsersByPartialName = (partialName) => {
  const nameStr = Array.isArray(partialName)
    ? partialName[0]
    : String(partialName);

  const regex = new RegExp(nameStr, "i");

  return model
    .find({
      $or: [
        { firstName: { $regex: regex } },
        { lastName:  { $regex: regex } },
      ],
    })
    .exec();  
};

export const findAllUsers = () =>
  UserModel.find().exec();
