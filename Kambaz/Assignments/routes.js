import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  app.get("/api/courses/:cid/assignments", (req, res) => {
    const list = dao.findAssignmentsForCourse(req.params.cid);
    res.json(list);
  });

  app.get("/api/assignments/:aid", (req, res) => {
    const a = dao.findAssignmentById(req.params.aid);
    if (!a) return res.sendStatus(404);
    res.json(a);
  });

  app.post("/api/courses/:cid/assignments", (req, res) => {
    const payload = { ...req.body, course: req.params.cid };
    const created = dao.createAssignment(payload);
    res.json(created);
  });

  app.put("/api/assignments/:aid", (req, res) => {
    const updated = dao.updateAssignment(req.params.aid, req.body);
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  });

  app.delete("/api/assignments/:aid", (req, res) => {
    dao.deleteAssignment(req.params.aid);
    res.sendStatus(204);
  });
}
