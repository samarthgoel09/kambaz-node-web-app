import UserModel from "./model.js";
import bcrypt    from "bcrypt";
import model from "./model.js"; 
import { v4 as uuidv4 } from "uuid";  
/**
 * Create a new user document.
 */
export const createUser = (user) => {
  // strip any incoming _id
  const { _id, ...u } = user;
  const newUser       = { ...u, _id: uuidv4() };
  return model.create(newUser);
};



/**
 * Retrieve a single user by _id.
 */
export const findUserById = async (userId) => {
  return UserModel.findById(userId).exec();
};

/**
 * Retrieve a single user by username.
 */
export const findUserByUsername = async (username) => {
  return UserModel.findOne({ username }).exec();
};

/**
 * Retrieve a user by username & password.
 * Falls back to bcrypt if stored hashed.
 */
export const findUserByCredentials = async (username, password) => {
  // Try matching on username OR loginId
  const user = await UserModel.findOne({
    $or: [
      { username },
      { loginId: username }
    ]
  }).exec();

  if (!user) return null;

  // Plain-text match
  if (user.password === password) return user;

  // bcrypt match
  try {
    if (await bcrypt.compare(password, user.password)) {
      return user;
    }
  } catch (e) {
    console.warn("bcrypt.compare failed:", e.message);
  }

  return null;
};

/**
 * Update a user by _id with partial $set, running validators.
 */
export const updateUser = async (userId, updates) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).exec();
};

/**
 * Delete a user by _id.
 */
export const deleteUser = async (userId) => {
  return UserModel.findByIdAndDelete(userId).exec();
};
export const findUsersByRole = (role) =>
  UserModel.find({ role }).exec();

/** Find users by partial first or last name (case‐insensitive) */
export const findUsersByPartialName = (partialName) => {
  // Ensure we always have a string
  const nameStr = Array.isArray(partialName)
    ? partialName[0]
    : String(partialName);

  // Build a case-insensitive regex
  const regex = new RegExp(nameStr, "i");

  // Return a Promise
  return model
    .find({
      $or: [
        { firstName: { $regex: regex } },
        { lastName:  { $regex: regex } },
      ],
    })
    .exec();  
};

/** Find all users (no filter) */
export const findAllUsers = () =>
  UserModel.find().exec();
