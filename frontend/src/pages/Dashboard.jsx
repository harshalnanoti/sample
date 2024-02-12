// Dashboard.jsx

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getTasks, reset } from "../features/task/taskSlice";
import Spinner from "../components/Spinner";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import AssignedTask from "../components/AssignedTask";

// import "../styles/dashboard.css"; 
// Assuming you have a separate CSS file for the dashboard styles

function Dashboard() {
  const dispatch = useDispatch();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [createdTasks, setCreatedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [radioData, setRadioData] = useState("");
  const { tasks, isLoading: tasksLoading, isError, message } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (!user) {
      // Redirect or handle the case where the user is not available
      return;
    }

    setIsLoading(true);

    // Fetch all tasks
    dispatch(getTasks()).then(() => {
      setIsLoading(false);
    });

    return () => {
      // Reset the tasks state when the component unmounts
      dispatch(reset());
    };
  }, [user, isError, message, dispatch]);

  useEffect(() => {
    // Check if the user is available before filtering tasks
    if (user) {
      // Filter assigned tasks and created tasks
      const assigned = tasks.filter((task) => task.assignedTo === user._id);
      const created = tasks.filter((task) => task.user === user._id);

      setAssignedTasks(assigned);
      setCreatedTasks(created);
    }
  }, [tasks, user]);
  return (
    <div className="dashboard-container">
      {user ? (
        <>
          {(isLoading || tasksLoading) && <Spinner />}
          <header className="dashboard-header">
            {/* <h1>Welcome {user?.name}</h1> */}
            <p>Tasks Dashboard</p>
          </header>
          <TaskForm />

          <section className="dashboard-content">
            <div className="dashboard-tasks">
              <div className="assigned-tasks">
                <h2>Assigned Tasks</h2>
                {assignedTasks.length > 0 ? (
                  assignedTasks.map((task) => (
                    <AssignedTask key={task._id} task={task} />
                  ))
                ) : (
                  <p>No assigned tasks</p>
                )}
              </div>

              <div className="created-tasks">
                <h2>Created Tasks</h2>
                {createdTasks.length > 0 ? (
                  createdTasks.map((task) => (
                    <TaskItem key={task._id} task={task} />
                  ))
                ) : (
                  <p>No created tasks</p>
                )}
              </div>
            </div>
          </section>
        </>
      ) : (
        <p>Please log in to view the dashboard.</p>
      )}
    </div>
  );
}

export default Dashboard;
