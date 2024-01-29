const mongoose = require("mongoose");

const tasksSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a text field']
    },
    description: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    },
    assignedTo: {
        type: String,
        default: ''
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', tasksSchema);
        