const asyncHandler = require("express-async-handler");

const TasksModel = require("../models/tasksModel");
const UserModel = require("../models/usersModel");

// @desc Get task
// @route POST /api/tasks
// @access private
const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Fetch tasks where either the task is assigned to the user or created by the user
  const tasks = await TasksModel.find({
    $or: [{ user: userId }, { assignedTo: userId }],
  });

  res.status(200).json(tasks);
});

//////////////////////////////////////////////////////////
// @desc Set tasks
// @route SET /api/tasks
// @access private
const setTask = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("please add text field");
  }
  const { text, description, priority, dueDate, completed, assignedTo } =
    req.body;

  const task = await TasksModel.create({
    user: req.user.id,
    text,
    description: description || "",
    priority: priority || "medium",
    dueDate: dueDate || null,
    completed: completed || false,
    assignedTo: assignedTo || "",
  });
  res.status(200).json(task);
});

////////////////////////////////////////////////////
// @desc Update task
// @route PUT /api/tasks/:id
// @access private
const updateTasks = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  // Check if the task exists and is either assigned to the user or created by the user
  const task = await TasksModel.findOne({ _id: taskId, $or: [{ user: userId }, { assignedTo: userId }] });

  if (!task) {
    res.status(404).json({ error: "Task not found or user not authorized" });
    return;
  }

  // Check if the assigned user is updating the completed field
  if (task.assignedTo && task.assignedTo.toString() === userId && req.body.completed !== undefined) {
    task.completed = req.body.completed;
  }

  // Update other fields if needed
  task.text = req.body.text || task.text;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.dueDate = req.body.dueDate || task.dueDate;
  task.assignedTo = req.body.assignedTo || task.assignedTo;

  const updatedTask = await task.save();

  res.status(200).json(updatedTask);
});

/////////////////////////////////////////////////////////////////////
// @desc Delete tasks
// @route delete /api/tasks/:id
// @access private
const deleteTasks = asyncHandler(async (req, res) => {
  const deletedtask = await TasksModel.findById(req.params.id);
  if (!deletedtask) {
    res.status(404).json({ error: "Task not found" });
  }

   // Check if the user is authorized to delete the task
   if (deletedtask.user.toString() !== req.user.id && deletedtask.assignedTo.toString() !== req.user.id) {
    res.status(403).json({ error: "User not authorized" });
    return;
  }

  await deletedtask.deleteOne()

  res.status(200).json({ id: req.params.id })
});

//////////////////////////////////////////////////////////////////////
  //@desc get tasks
  //@route GET /api/tasks/:id
  //@access private
  const getTask = asyncHandler(async (req, res) => {
    const task = await TasksModel.findById(req.params.id);
  
    if (!task) {
      res.status(404);
      throw new Error("Task not Found");
    }
  
    const user = await UserModel.findById(req.user.id);
  
    if (!user) {
      res.status(401);
      throw new Error("User Not Found");
    }
  
    // Check if the logged-in user is the task owner or assigned to the task
    if (
      task.user.toString() !== user.id &&
      (!task.assignedTo || (Array.isArray(task.assignedTo) && task.assignedTo.includes(user.id)))
    ) {
      res.status(401);
      throw new Error("User not authorized");
    }
  
    // Send the task data in the response
    res.status(200).json(task);
  });

module.exports = {
  getTasks,
  setTask,
  updateTasks,
  deleteTasks,
  getTask,
};
