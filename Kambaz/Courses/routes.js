import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";

export default function CourseRoutes(app) {

  app.post("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    const module = {
      ...req.body,
      course: courseId,
    };
    const newModule = modulesDao.createModule(module);
    res.send(newModule);
  });



  app.get("/api/courses", (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  });
    app.delete("/api/courses/:courseId", (req, res) => {
    const { courseId } = req.params;
    const status = dao.deleteCourse(courseId);
    res.send(status);
  });
     app.get("/api/courses/:courseId/modules", (req, res) => {
    const { courseId } = req.params;
    const mods = modulesDao.findModulesForCourse(courseId);
    res.json(mods);
  });


    app.put("/api/courses/:courseId", (req, res) => {
   const { courseId } = req.params;
   const courseUpdates = req.body;
   const updated = dao.updateCourse(courseId, courseUpdates);
   if (updated) {
     return res.json(updated);
   } else {
     return res.sendStatus(404);
   }
 });
}
