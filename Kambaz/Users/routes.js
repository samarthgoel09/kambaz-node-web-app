import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";
export default function UserRoutes(app) {
     const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };
  app.post("/api/users/current/courses", createCourse);
  const createUser = (req, res) => { };
  const deleteUser = (req, res) => { };
  const findAllUsers = (req, res) => { };
  const findUserById = (req, res) => { };
  const updateUser = (req, res) => { 
 const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
        res.json(currentUser);


  };
 const signup = (req, res) => {
    const { username, password } = req.body;
    if (dao.findUserByUsername(username)) {
      return res.status(400).json({ message: "Username already in use" });
    }
    const currentUser = dao.createUser({ username, password });
    req.session.currentUser = currentUser;
    res.json(currentUser);
  };

  app.post("/api/users/signup", signup);
  const signin = (req, res) => {
  console.log("→ [SIGNIN] req.body =", req.body);
  const { username, password } = req.body;
  const user = dao.findUserByCredentials(username, password);
  console.log(
    user
      ? `→ [SIGNIN] success for ${username}`
      : `→ [SIGNIN] failed for ${username}`
  );
  if (user) {
    req.session.currentUser = user;
    return res.json(user);
  }
  res.status(401).json({ message: "Invalid credentials" });
};


 const profile = async (req, res) => {
     const currentUser = req.session["currentUser"];
    if (!currentUser) {
      res.sendStatus(401);
      return;
    }

    res.json(currentUser);
  };
  
 const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/users/signin", signin);
 const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };
 
  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
}
