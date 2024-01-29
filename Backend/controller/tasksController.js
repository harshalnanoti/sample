const asyncHandler = require('express-async-handler')





// @desc Get task
// @route POST /api/tasks
// @access private
const getTasks = asyncHandler(async(req,res)=> {
    res.status(200).json({message:'Get Tasks'})
})

// @desc Set tasks
// @route SET /api/tasks
// @access private
const setTask = asyncHandler(async(req,res)=> {
   if(!req.body.text){
    res.status(404)
    throw new Error("please add text field")
   }
    res.status(200).json({message:'Create Task'})
})

// @desc Update task
// @route PUT /api/tasks/:id
// @access private
const updateTasks = asyncHandler(async(req,res)=> {
    res.status(200).json({message:`Update Tasks : ${req.params.id}`})
})

// @desc Delete tasks
// @route delete /api/tasks/:id
// @access private
const deleteTasks = asyncHandler(async(req,res)=> {
    res.status(200).json({message:`Delete Tasks : ${req.params.id}`})
})


module.exports ={
    getTasks,
    setTask,
    updateTasks,
    deleteTasks
}