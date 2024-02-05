const express = require("express");
const router = express.Router();
const {
  getTasks,
  setTask,
  updateTasks,
  deleteTasks,
  getTask,
} = require("../controller/tasksController");
const {protect} = require('../middleware/authMiddleware')

router.route("/").get(protect, getTasks).post(protect, setTask);

router.route("/:id").put(protect, updateTasks).delete(protect, deleteTasks);

module.exports = router;
