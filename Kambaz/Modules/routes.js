import * as modulesDao from "./dao.js";

export default function ModuleRoutes(app) {
  app.post("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const mod = await modulesDao.createModule({
        ...req.body,
        course: req.params.courseId,
      });
      res.json(mod);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  app.get("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const mods = await modulesDao.findModulesForCourse(req.params.courseId);
      res.json(mods);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  app.put("/api/modules/:moduleId", async (req, res) => {
    try {
      const updated = await modulesDao.updateModule(
        req.params.moduleId,
        req.body
      );
      if (!updated) return res.sendStatus(404);
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  app.delete("/api/modules/:moduleId", async (req, res) => {
    try {
      await modulesDao.deleteModule(req.params.moduleId);
      res.sendStatus(204);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });
}
