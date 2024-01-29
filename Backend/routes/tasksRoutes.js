const express = require('express')
const router = express.Router()
const { getTasks,
    setTask,
    updateTasks,
    deleteTasks,
    getTask} = require('../controller/tasksController')

router.route('/').get(getTasks).post(setTask)

router.route('/:id').put(updateTasks).delete(deleteTasks).get(getTask)


module.exports = router