import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";
import authService from "../features/auth/authService";
import { deleteTask, updateTask } from "../features/task/taskSlice";
import { Link, useNavigate } from "react-router-dom";


const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [assignedUserName, setAssignedUserName] = useState("Unknown");
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTaskData, setUpdatedTaskData] = useState({
    text: task.text,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate,
    completed: task.completed,
    assignedTo: task.assignedTo,
  });

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userData = await authService.getUser();
        const assignedUser = userData.find(
          (user) => user._id === task.assignedTo
        );
        setAssignedUserName(assignedUser ? assignedUser.name : "Unknown");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [task.assignedTo]);



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitUpdate = () => {
    // Dispatch the updateTask action with the updated task data
    dispatch(updateTask({ taskId: task._id, updatedTaskData }));
    setIsEditing(false);
  };

  return (
    <div className="task">
      <div className="task-info">
        {/* Display task information */}
        {isEditing ? (
          // Render editable fields when editing
          <div className="task-edit-form">
            <input
              type="text"
              name="text"
              value={updatedTaskData.text}
              onChange={handleInputChange}
            />
            {/* Add other editable fields as needed */}
            <button onClick={handleSubmitUpdate} className="edit">
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        ) : (
          // Display task information
          <>
            <div className="task-date">
              {new Date(task.createdAt).toDateString("en-us")}
            </div>
            <div className="task-details">
              <p>
                <strong>Text:</strong> {task.text}
              </p>
              <p>
                <strong>Description:</strong> {task.description}
              </p>
              <p>
                <strong>Priority:</strong> {task.priority}
              </p>
              <p>
                <strong>Due Date:</strong> {task.dueDate}
              </p>
              <p>
                <strong>Completed:</strong> {task.completed ? "Yes" : "No"}
              </p>
              <p>
                <strong>Assigned To:</strong> {assignedUserName}
              </p>
            </div>

            {/* ... (existing code) */}
          </>
        )}
      </div>
      <div className="task-actions">
        <button
          onClick={() => dispatch(deleteTask(task._id))}
          className="close"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        {!isEditing && (
          // Instead of handling update directly, navigate to the update page
          <Link to={`/update/${task._id}`} className="edit">
            <FontAwesomeIcon icon={faEdit} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
