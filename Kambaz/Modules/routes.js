import * as modulesDao from "./dao.js";
export default function ModuleRoutes(app) {
  app.delete("/api/modules/:moduleId", (req, res) => {
    const { moduleId } = req.params;
    modulesDao.deleteModule(moduleId);
    res.sendStatus(204);
  });
  app.put("/api/modules/:moduleId", (req, res) => {
    console.log("→ [ROUTE] PUT /api/modules/:moduleId", req.params.moduleId, req.body);
    const updated = modulesDao.updateModule(req.params.moduleId, req.body);
    if (!updated) {
      return res.sendStatus(404);
    }
    res.json(updated);
  });
}
