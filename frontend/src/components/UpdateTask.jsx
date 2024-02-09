import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { updateTask, getTaskById } from "../features/task/taskSlice";
import { useNavigate } from "react-router-dom";
import authService from "../features/auth/authService";

const UpdateTask = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updatedTaskData, setUpdatedTaskData] = useState({
    text: "",
    description: "",
    priority: "medium",
    dueDate: "",
    completed: false,
    assignedTo: "",
  });

  const [users, setUsers] = useState([]); // Added state for users

  const { tasks, isLoading, isError, message } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getTaskById(taskId));
        const usersData = await authService.getUser(); // Fetch users
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchData();
  }, [dispatch, taskId]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (tasks && tasks.length > 0) {
      const [fetchedTask] = tasks;
      setUpdatedTaskData({
        text: fetchedTask.text || "",
        description: fetchedTask.description || "",
        priority: fetchedTask.priority || "medium",
        dueDate: fetchedTask.dueDate || "",
        completed: fetchedTask.completed || false,
        assignedTo: fetchedTask.assignedTo || "",
      });
    } else {
      console.log("No task data available.");
    }
  }, [tasks, isLoading]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setUpdatedTaskData((prevData) => ({
      ...prevData,
      [name]: inputValue,
    }));
  };

  const handleUpdateTask = () => {
    dispatch(updateTask({ taskId, updatedTaskData }));
    navigate("/");
  };

  return (
    <div>
      <h2>Edit Task</h2>
      <Link to={"/"} className="btn btn-block">
        Back to Task
      </Link>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>{message}</p>
      ) : (
        <form className="form">
          <div className="form-group">
            <label htmlFor="text">Task:</label>
            <input
              type="text"
              name="text"
              value={updatedTaskData.text}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              name="description"
              value={updatedTaskData.description}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              name="priority"
              id="priority"
              value={updatedTaskData.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              name="dueDate"
              value={updatedTaskData.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="completed">Completed:</label>
            <input
              type="checkbox"
              name="completed"
              checked={updatedTaskData.completed}
              onChange={handleInputChange}
              style={{ transform: "scale(1.5)" }}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignedTo">Assigned To</label>
            <select
              name="assignedTo"
              id="assignedTo"
              value={updatedTaskData.assignedTo}
              onChange={handleInputChange}
            >
              <option value="">Select user</option>
              {users &&
                users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <button
              type="button"
              className="btn btn-block"
              onClick={handleUpdateTask}
            >
              Update Task
            </button>
          </div>
          {/* ... existing form fields ... */}
        </form>
      )}
    </div>
  );
};

export default UpdateTask;
