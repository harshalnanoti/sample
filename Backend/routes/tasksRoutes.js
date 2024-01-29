const express = require('express')
const router = express.Router()
const { getTasks,
    setTask,
    updateTasks,
    deleteTasks} = require('../controller/tasksController')

router.route('/').get(getTasks).post(setTask)

router.route('/:id').put(updateTasks).delete(deleteTasks)


module.exports = router