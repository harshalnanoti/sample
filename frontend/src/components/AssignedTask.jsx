// AssignedTask.jsx

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import authService from "../features/auth/authService";
import { updateTask, deleteTask } from "../features/task/taskSlice";
import { Link, useNavigate } from "react-router-dom";
import { faTrash, faEdit, faCheck } from "@fortawesome/free-solid-svg-icons";

const AssignedTask = ({ task , isAssignedByUser }) => {
  const dispatch = useDispatch();
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
          (user) => user._id === (isAssignedByUser ? task.assignedTo : task.user)
        );
        setAssignedUserName(assignedUser ? assignedUser.name : "Unknown");
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserName();
  }, [task.assignedTo, task.user, isAssignedByUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitUpdate = () => {
    dispatch(updateTask({ taskId: task._id, updatedTaskData }));
    setIsEditing(false);
  };

  return (
    <div className="task">
      <div className="task-info">
        {isEditing ? (
          <div className="task-edit-form">
            <input
              type="text"
              name="text"
              value={updatedTaskData.text}
              onChange={handleInputChange}
            />
            <button onClick={handleSubmitUpdate} className="edit">
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
        ) : (
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
                <strong>Assigned By:</strong> {assignedUserName}
              </p>
            </div>
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

export default AssignedTask;
