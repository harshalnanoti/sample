// YourDashboardComponent.js
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData } from "../features/task/taskSlice";

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error: {message}</p>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id}>{task.text}</div>
        // Render other task details as needed
      ))}
    </div>
  );
};

export default UserDashboard;
