const asyncHandler = require("express-async-handler");

const TasksModel = require("../models/tasksModel");
const UserModel = require("../models/usersModel");

// @desc Get task
// @route POST /api/tasks
// @access private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await TasksModel.find({ user: req.user.id });
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

  const updatedTask = await TasksModel.findOneAndUpdate(
    { _id: taskId, user: userId },
    req.body,
    { new: true }
  );

  if (!updatedTask) {
    res.status(404).json({ error: "Task not found or user not authorized" });
    return;
  }

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

  if (deletedtask.user.toString() !== req.user.id) {
    res.status(403).json({ error: "User not authorized" });
  }


  // Make sure the logged in user matches the goal user
  if (deletedtask.user.toString() !== req.user.id) {
    res.status(401)
    throw new Error('User not authorized')
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
  //check for user
  if (!user) {
    res.status(401);
    throw new Error("User Not Found");
  }
  // make sure the logged in user matches the goal
  if(task.user.toString()!== user.id){
    res.status(401)
    throw new Error("user not authorized")
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
