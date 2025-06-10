import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findEnrollmentsForUser(userId) {
  return Database.enrollments.filter(e => e.user === userId);
}

export function findEnrollmentByUserCourse(userId, courseId) {
  return Database.enrollments.find(
    e => e.user === userId && e.course === courseId
  );
}
export function createEnrollment(userId, courseId) {
  const newE = { _id: uuidv4(), user: userId, course: courseId };
  Database.enrollments.push(newE);
  return newE;
}
export function deleteEnrollmentById(enrollmentId) {
  Database.enrollments = Database.enrollments.filter(
    e => e._id !== enrollmentId
  );
}
