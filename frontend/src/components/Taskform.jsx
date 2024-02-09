import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../features/task/taskSlice";
import authService from "../features/auth/authService";

const TaskForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersNames = async () => {
      try {
        const usersNames = await authService.getUser();
        console.log(usersNames); // Log users to the console
        setUsers(usersNames);
      } catch (error) {
        console.error('Error fetching user names:', error.message);
      }
    };

    fetchUsersNames();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createTask({
        text,
        description,
        priority,
        dueDate,
        completed,
        assignedTo,
      })
    );
    setText("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setCompleted(false);
    setAssignedTo("");
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="text">Task</label>
          <input
            type="text"
            name="text"
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            name="priority"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            name="dueDate"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="completed">Completed</label>
          <input
            type="checkbox"
            name="completed"
            id="completed"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            style={{ transform: "scale(1.5)" }}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="assignedTo">Assigned To</label>
          <select
            name="assignedTo"
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
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
          <button className="btn btn-block" type="submit">
            Add Task
          </button>
        </div>
      </form>
    </section>
  );
};

export default TaskForm;
