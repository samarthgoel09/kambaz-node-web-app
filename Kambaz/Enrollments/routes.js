

import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";  

export default function EnrollmentRoutes(app) {
  function resolveUserId(paramUserId, session) {
    if (paramUserId === "current") {
      const cu = session.currentUser;
      if (!cu) return null;
      return cu._id;
    }
    return paramUserId;
  }

  app.get("/api/users/:userId/courses", (req, res) => {
    const uid = resolveUserId(req.params.userId, req.session);
    if (!uid) return res.sendStatus(401);

    const enrollments = dao.findEnrollmentsForUser(uid);
    const courses = enrollments
      .map(e => courseDao.findCourseById(e.course))
      .filter(c => !!c);

    res.json(courses);
  });

  app.get("/api/users/:userId/enrollments", (req, res) => {
    const uid = resolveUserId(req.params.userId, req.session);
    if (!uid) return res.sendStatus(401);
    const list = dao.findEnrollmentsForUser(uid);
    res.json(list);
  });

  app.post("/api/users/:userId/courses/:courseId", (req, res) => {
    const uid = resolveUserId(req.params.userId, req.session);
    if (!uid) return res.sendStatus(401);
    const cid = req.params.courseId;

    if (dao.findEnrollmentByUserCourse(uid, cid)) {
      return res.sendStatus(409); 
    }

    const created = dao.createEnrollment(uid, cid);
    res.status(201).json(created);
  });

  app.delete("/api/users/:userId/courses/:courseId", (req, res) => {
    const uid = resolveUserId(req.params.userId, req.session);
    if (!uid) return res.sendStatus(401);
    const cid = req.params.courseId;

    const enroll = dao.findEnrollmentByUserCourse(uid, cid);
    if (!enroll) return res.sendStatus(404);

    dao.deleteEnrollmentById(enroll._id);
    res.sendStatus(204);
  });
}
