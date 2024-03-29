import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks/";

// create task
const createTask = async (taskData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, taskData, config);

  return response.data;
};

// get task
const getTasks = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);

  return response.data;
};

const getTaskById = async (taskId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL + taskId, config);

  return response.data;
};

// update task
const updateTask = async (taskId, updatedTaskData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(
    `${API_URL}${taskId}`,
    updatedTaskData,
    config
  );

  return response.data;
};

//delete

const deleteTask = async (taskId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(API_URL + taskId, config);

  return response.data;
};

const taskService = {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  getTaskById,
};

export default taskService;
