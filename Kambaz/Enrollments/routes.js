import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  function resolveUserId(param, session) {
    if (param === "current") {
      const cu = session.currentUser;
      return cu?._id ?? null;
    }
    return param;
  }

  app.get("/api/users/:userId/enrollments", async (req, res) => {
    const uid = resolveUserId(req.params.userId, req.session);
    if (!uid) return res.sendStatus(401);
    const list = await dao.findEnrollmentsForUser(uid);
    res.json(list);
  });

  app.get("/api/users/:userId/courses", async (req, res) => {
    const uid = resolveUserId(req.params.userId, req.session);
    if (!uid) return res.sendStatus(401);
    const courses = await dao.findCoursesForUser(uid);
    res.json(courses);
  });

  app.post("/api/users/:userId/courses/:courseId", async (req, res) => {
    const uid = resolveUserId(req.params.userId, req.session);
    if (!uid) return res.sendStatus(401);
    const cid = req.params.courseId;
    const existing = await dao.findEnrollmentsForUser(uid)
      .then(list => list.find(e => e.course === cid));
    if (existing) return res.sendStatus(409);
    const created = await dao.enrollUserInCourse(uid, cid);
    res.status(201).json(created);
  });

  app.delete("/api/users/:userId/courses/:courseId", async (req, res) => {
    const uid = resolveUserId(req.params.userId, req.session);
    if (!uid) return res.sendStatus(401);
    const cid = req.params.courseId;
    await dao.unenrollUserFromCourse(uid, cid);
    res.sendStatus(204);
  });

  app.get("/api/courses/:courseId/enrollments", async (req, res) => {
    const list = await dao.findEnrollmentsForCourse(req.params.courseId);
    res.json(list);
  });
}
