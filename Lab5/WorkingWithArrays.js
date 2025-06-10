
export default function WorkingWithArrays(app) {
  let todos = [
    { id: 1, description: "Task 1", completed: false },
    { id: 2, description: "Task 2", completed: true },
    { id: 3, description: "Task 3", completed: false },
    { id: 4, description: "Task 4", completed: true },
  ];

  app.get("/lab5/todos/create", (req, res) => {
    const newTodo = { id: Date.now(), description: "New Task", completed: false };
    todos.push(newTodo);
    res.json(todos);
  });
    app.post("/lab5/todos", (req, res) => {
    const newTodo = { ...req.body,  id: new Date().getTime() };
    todos.push(newTodo);
    res.json(newTodo);
  });

  app.get("/lab5/todos", (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const bool = completed === "true";
      return res.json(todos.filter((t) => t.completed === bool));
    }
    res.json(todos);
  });

  app.get("/lab5/todos/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const todo = todos.find((t) => t.id === id);
    res.json(todo || null);
  });

  app.get("/lab5/todos/:id/delete", (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log(`[DELETE-GET] Requested delete for ID=${id}`);  // ← debug log
    const idx = todos.findIndex((t) => t.id === id);
    if (idx !== -1) {
      todos.splice(idx, 1);
      console.log(`[DELETE-GET] Deleted index ${idx}, remaining todos:`, todos);
      return res.json(todos);
    }
    console.warn(`[DELETE-GET] Todo not found for ID=${id}`);
    return res.status(404).send("Todo not found");
  });

  app.delete("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
     if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
      return;
    }

    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  });


  app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const completed = req.params.completed === "true";
    const idx = todos.findIndex((t) => t.id === id);
    if (idx !== -1) {
      todos[idx].completed = completed;
      return res.json(todos);
    }
    return res.status(404).send("Todo not found");
  });

  app.get("/lab5/todos/:id/description/:description", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const desc = req.params.description;
    const idx = todos.findIndex((t) => t.id === id);
    if (idx !== -1) {
      todos[idx].description = desc;
      return res.json(todos);
    }
    return res.status(404).send("Todo not found");
  });
  app.put("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
     const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
      return;
    }

    todos = todos.map((t) => {
      if (t.id === parseInt(id)) {
        return { ...t, ...req.body };
      }
      return t;
    });
    res.sendStatus(200);
  });


}
