import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    _id: String,
    name: { type: String, required: true },
    description: String,
    course: { type: String, ref: "CourseModel", required: true },
  },
  { collection: "modules" }
);

export default moduleSchema;
