import React from "react";
import { useEffect,useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../features/task/taskSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import authService from "../features/auth/authService";

const TaskItem = ({ task }) => {
  const dispatch = useDispatch();
  // Function to get user name based on user ID
  const [assignedUserName, setAssignedUserName] = useState("Unknown");
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

  return (
    <div className="task">
      <div className="task-info">
        <div className="task-date">
          {new Date(task.createdAt).toDateString("en-us")}
        </div>
        <h2>{task.text}</h2>
        <div className="task-details">
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
      </div>
      <button onClick={() => dispatch(deleteTask(task._id))} className="close">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export default TaskItem;
