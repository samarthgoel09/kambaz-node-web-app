import ModuleModel from "./model.js";
import { v4 as uuidv4 } from "uuid";

export async function createModule(module) {
  const newMod = { _id: uuidv4(), ...module };
  return ModuleModel.create(newMod);
}

export function findModulesForCourse(courseId) {
  return ModuleModel.find({ course: courseId }).exec();
}

export function updateModule(moduleId, updates) {
  return ModuleModel.findByIdAndUpdate(
    moduleId,
    { $set: updates },
    { new: true, runValidators: true }
  ).exec();
}

export function deleteModule(moduleId) {
  return ModuleModel.deleteOne({ _id: moduleId }).exec();
}
