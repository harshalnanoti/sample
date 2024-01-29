const asyncHandler = require("express-async-handler");

const TasksModel = require("../models/tasksModel");

// @desc Get task
// @route POST /api/tasks
// @access private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await TasksModel.find();
  res.status(200).json(tasks);
});

// @desc Set tasks
// @route SET /api/tasks
// @access private
const setTask = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(404);
    throw new Error("please add text field");
  }
  const { text, description, priority, dueDate, completed, assignedTo } = req.body;

  const task = await TasksModel.create({
    text ,
    description:description || '',
    priority:priority || 'medium',
    dueDate:dueDate || null,
    completed:completed || false,
    assignedTo: assignedTo || '',
  });
  res.status(200).json(task);
});

// @desc Update task
// @route PUT /api/tasks/:id
// @access private
const updateTasks = asyncHandler(async (req, res) => {
  const task = await TasksModel.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const updatedTask = await TasksModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedTask);
});

// @desc Delete tasks
// @route delete /api/tasks/:id
// @access private
const deleteTasks = asyncHandler(async (req, res) => {
  const deletedtask = await TasksModel.findById(req.params.id);
  if (!deletedtask) {
    res.status(404);
    throw new Error("Task not found");
  }
  await TasksModel.deleteOne({ _id: req.params.id });
  res.status(200).json(deletedtask);
});


//@desc get contact
//@route GET /api/tasks/:id 
//@access private
const getTask = asyncHandler(async (req, res) => {
  const task = await TasksModel.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not Found");
  }
  res.status(200).json(task);
});

module.exports = {
  getTasks,
  setTask,
  updateTasks,
  deleteTasks,
  getTask,
};
